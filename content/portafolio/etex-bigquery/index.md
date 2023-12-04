---
title: "Etex y la vez que escribí demasiado SQL"
date: 2023-12-03
summary: "No demasiado para romper BigQuery pero sí como para quemarme el cerebro."
showSummary: true
showDate: false
showReadingTime: false
showAuthor: false
sharingLinks: false
showWordCount: false
---

El siguiente proyecto consiste en el procesamiento de datos para un dashboard interno para Etex. En este caso, no importa tanto el dashboard (yo no lo cree, se hizo mediante tecnologías de desarrollo front-end) si no los queries que lo alimentan.

Por otro lado, quería aclarar que no mostraré los queries enteros del proyecto, ya que son información sensible. En cambio, mostraré algunos trucos que me ayudaron a cumplir el trabajo de manera satisfactoria.

## Contexto del problema

Etex, siendo el líder del mercado en productos de drywall, fideliza a sus compradores del segmento de trabajadores de la construcción mediante Constructores del futuro. Se trata de una escuela con contenido on-demand y en vivo para maestros de obra, electricistas, arquitectos y profesionales en la línea de la construcción.

_El reto: extraer data generada de eventos de Google Analytics 4 para enviarla a un tablero de mando dentro del administrador de la aplicación._

## Queries de SQL que me ayudaron

### Conociendo a nuestros usuarios

Haciendo uso del `user_id` de Google Analytics 4, no es complicado identificar usuarios logueados y no logueados en la aplicación:

```sql
if(user_id is null, 'non-logged', 'logged') as status
```

Además, es relevante para rl dashboard conocer desde que país se conectan. Aquí hay una discrepancia interesante, ya que muchos usuarios declaran un país en el registro pero realmente se conectan desde otro. Para conocer las discrepancias y cuanto difiere, usamos esta consulta

```sql
select
    case
        when (geo.country = 'Peru') then 'pe'
        when (geo.country = 'Chile') then 'cl' 
        when (geo.country = 'Ecuador') then 'ec' 
        when (geo.country = 'Colombia') then 'co' else 'otros' 
        end as session_country,
    (select value.string_value from unnest(user_properties) where key = "country") as user_country,
    count(distinct user_pseudo_id) as users
from`proyecto.analytics_1234567890.events_*`
group by session_country, user_country
order by session_country
```

Al hacer esta comparación, observamos que `geo.country` es más preciso que el país declarado por el usuario.

### Métricas de Google Analytics 4

Cabe destacar que se extrajeron más métricas de GA4 a parte de las mostradas, pero estas dos me parecieron los casos más ilustrativos para este proyecto. Estas queries se combinaron con otras para extraer los valores de las métricas por país y estado del usuario (logueado / no logueado).

#### Sesiones

El conteo de sesiones se da mediante la siguiente consulta:

```sql
count(
    distinct concat(
        user_pseudo_id,
        (select value.int_value from unnest(event_params) where key = 'ga_session_id')
    )
) as sessions
```

Al unir el pseudo ID del usuario y el id de la sesión (del evento session start) se evita contar posibles sesiones duplicadas.

#### Entradas

Las entradas a cada página se registran de esta manera:

```sql
count(case 
    when (select 
        value.int_value 
        from unnest(event_params) 
        where event_name = 'page_view' 
        and key = 'entrances') = 1 then concat(ga4_export.user_pseudo_id,
        (select 
            value.int_value 
            from unnest(event_params) 
            where key = 'ga_session_id')
        )
        end) as entrances
```

### Agregando la data

Finalmente, se agrega la data en cada vista usando la función `OVER` junto a `PARTITION BY`, de manera que los cálculos se ejecutaran sobre cada fecha, país y status del usuario. Se hizo de la siguiente manera porque el dashboard necesitaba llamar a la data en crudo para procesarla en su propio servidor.

```sql
sum(bounce_rate) / sum(count(distinct session_id)) over(partition by event_date, session_country, status) as bounce_rate_page
```

## Resultados

Gracias a estos queries y técnicas de consulta, el equipo de fidelización de Etex puede ver la data que realmente importa sobre las interacciones de su sitio web, segmentada por país y estado del usuario en la aplicación.