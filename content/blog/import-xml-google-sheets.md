---
title: "Usando IMPORTXML en Google Sheets"
date: 2023-07-25
description: Guía para utilizar IMPORTXML para extraer data de cualquier sitio web.
summary: Guía para utilizar IMPORTXML para extraer data de cualquier sitio web.
showSummary: true
slug: import-xml-google-sheets
tags:
  - web scraping
  - xpath
  - xml
  - google sheets
---
Una de las ventajas más asombrosas de Google Sheets es que es una aplicación web que está conectada a internet y puede interactuar con otros sitios web y API. Esto viene siendo muy útil cuando necesitamos extraer data de sitios web, y gracias a la fórmula `IMPORTXML` se puede escalar esta tarea a miles de URL. En esta guía aprenderemos a utilizarla para scrapear la internet y obtener la data que queramos de cualquier página web.

## ¿Qué funcionamiento tiene la fórmula IMPORTXML?

La fórmula `IMPORTXML` funciona como cualquier otra fórmula de Google Sheets, en donde se invoca usando el símbolo `=` y luego el nombre de la fórmula. Luego de su llamada, nos aparece un mensaje de `Loading...` que nos indica que nuestra llamada está cargando. Una vez termine de cargar, si es que la llamada fue exitosa, aparece el contenido que estamos utilizando.

Con esta fórmula podemos importar datos de los siguientes formatos: XML, HTML, RSS, TSV y Atom XML.

![Animación mostrando el uso de la fórmula IMPORTXML en Google Sheets](/img/google-sheets-importxml-funcionamiento.gif "Ejemplo de uso de IMPORTXML en Google Sheets")

### Sintaxis de la fórmula IMPORTXML

La sintaxis de la fórmula IMPORTXML se conforma de dos partes:

```vbnet
=IMPORTXML(url, xpath)
```

* URL: Se trata de la URL de la que queremos extraer información. Algunas consideraciones:

  * Debe incluir el protocolo (HTTPS o HTTP).
  * Puede ser una URL plana (<https://spelucin.me>) o una referencia a una sola celda (A3).
* XPath: Consulta de XPath que indica el elemento específico que queremos tomar de ese sitio web. XPath es un lenguaje que permite navegar nodos de HTML y XML. Una consulta de XPath luce de la siguiente manera:

```xquery
//p[@class='párrafo-principal']
```

Si esta es tu primera vez trabajando con XPath, no te preocupes, en la siguiente sección explicaremos como funciona y algunos trucos que debes conocer para usarlo de manera efectiva.

### ¿Cómo encontrar la expresión XPath?

XPath es una sintaxis que nos permite navegar entre los nodos de un documento HTML o XML para extraer su contenido. Funciona de manera similar a SQL en el sentido que se trata de hacer una *consulta* a un documento HTML y obtener un resultado de ella.

El lenguaje XPath es muy funcional y tiene varias opciones para encontrar los elementos de una web. Además de tener opciones para navegar por cualquier atributo HTML, tiene funciones lógicas, operaciones con texto y más características que te permitirán extraer contenido de manera detallada.

Algunas consultas comunes de XPath para el SEO son:

* `//h1` - Extrae el título H1 de la página.
* `//h2` - Extrae todos los H2.
* `//title` - Extrae el meta-título.
* `//meta[@name='description']/@content` - Extrae la meta-descripción.
* `//@href` - Extrae todos los enlaces.
* `//link[@rel=’canonical’]/@href` - Extrae el enlace canónico de una web.
* `//*[@itemtype]/@itemtype` - Extrae cualquier tipo de Schema.
* `//*[@hreflang]` - Extrae las etiquetas hreflang.
* `//a/text()` - Extrae todos los textos de ancla.
* `//meta[@name='robots']/@content` - Extrae el contenido de la etiqueta *meta robots*

Nótese que al momento de usar elementos encerrados con comillas, usamos las comillas simples (') y no las dobles ("), ya que usar las dobles interfiere con la sintaxis de fórmulas generales de Google Sheets, en la que un par de comillas dobles abre y cierran los argumentos de una fórmula.

Si bien podrías manejarte con tranquilidad con esta lista de consultas, es mucho mejor aprender el funcionamiento y sintaxis de XPath. Puedes encontrar una explicación más detallada de este lenguaje en [la guía sobre XPath para SEO](/posts/xpath-seo/).

## Posibles errores al momento de usar IMPORTXML en Google Sheets

Si bien la fórmula es simple de usar, es importante tener algunas consideraciones antes de empezar a sacarle el jugo.

### Extraer varios elementos con una sola consulta

¿Qué pasa si llamamos a un elemento que se repite varias veces? Por ejemplo, los encabezados H2 o todos los enlaces de la misma página. Google Sheets colocará los elementos resultantes, uno debajo de otro, de esta manera:

![Interfaz de Google Sheets mostrando el uso de la fórmula IMPORTXML cuando se usa con varios valores.](/img/importxml-google-sheets-varios-valores.png "Varios valores provenientes de una función IMPORTXML")

Por ello, es importante que, al momento de usar la fórmula y esperar más de un valor, es importante reservar espacio para todos ellos. Si existe un valor que interfiere en las celdas donde deberían estar los resultados, un error #REF! aparecerá:

![Interfaz de Google Sheets mostrando un error #REF! cuando se intenta usar IMPORTXML](./importxml-google-sheets-error-varios-valores.png "Error #REF! que aparece cuando una celda interfiere con una llamada a la función XPath con varios valores.")

En caso no tengas idea de cuántos elementos devuelve la consulta XPath solicitada, es recomendable ejecutar la fórmula en una columna nueva para evitar errores.

### Sitios web que bloquean su acceso

No todos los sitios web son accesibles para la fórmula IMPORTXML. Al usar la fórmula se envía una petición al sitio web que se incluye en el parámetro `url`; la cual puede ser bloqueada mediante:

* Una repuesta no 200 que se genera solo para los bots de Google
* Un bloqueo de los bots de Google mediante robots.txt
* El sitio web tiene parte de su contenido en JavaScript

Esto nos puede devolver un error que nos indica que no hay contenido que extraer, de la siguiente manera:

![Interfaz de Google Sheets mostrando un error de "El contenido importado está vacío" al usar IMPORTXML](/img/imporxml-error-sitio-bloqueado.png "Este error aparece cuando un sitio web bloquea a los robots de Google o el contenido está renderizado en JS")

El error también aparece cuando el contenido a scrapear está renderizado usando JavaScript. El bot que accede a la web no renderiza contenido agregado por JavaScript, por lo cual el contenido será invisible para la fórmula.

## Ejemplos de uso para IMPORTXML

### Extraer el contenido de la etiqueta `rel="canonical"`

La fórmula que usaríamos para extraer el contenido de las etiquetas canonical de una URL ubicada en la celda A2 es:

```vbnet
=IMPORTXML(A2, "//link[@rel=’canonical’]/@href")
```

Esta fórmula nos brinda el contenido de la etiqueta canonical de cualquier sitio web. La consulta XPath extrae el contenido de los elementos `<link>` donde el atributo `rel` sea igual a `canonical`. Debido a que solo nos interesa el enlace, añadimos `/@href` a la consulta.

### Extrayendo los valores del atributo `hreflang`

Similar al ejemplo anterior, podemos extraer los atributos de las etiquetas `hreflang`. Para ello, necesitamos dos fórmulas:

```vbnet
=IMPORTXML(A2, "//link[@hreflang]/@hreflang")
```

Esta primera fórmula nos da la lista de idiomas que contienen las etiquetas hreflang en una URL, según el orden de aparición en el código HTML.

Para obtener la lista de URL a donde apuntan esos atributos hreflang, necesitamos la siguiente fórmula:

```vbnet
=IMPORTXML(A2, "//link[@hreflang]/@href")
```

Aparecen en el mismo orden en el que se renderiza el HTML, similar a la fórmula anterior. Si colocamos ambas en dos celdas adyacentes, tenemos todo el contenido de la etiqueta `hreflang`.

## Pensamientos finales

La fórmula IMPORTXML es muy útil para extraer data de manera rápida y analizarla en el acto dentro del mismo Google Sheets. A nivel de SEO, podemos extraer los elementos que nos importan (meta etiquetas, canonical, encabezados, schema, etc.) y usar otras fórmulas y características de Google Sheets para profundizar en nuestro análisis de los elementos de nuestra web.

## Lecturas adicionales

Además de este post, recomiendo darte una vuelta por alguno de los siguientes enlaces:

* [Documentación oficial de Google Sheets sobre IMPORTXML](https://support.google.com/docs/answer/3093342?hl=es-419)
* [Guía de IMPORTXML e IMPORTHTML de Ben Collins (en inglés)](https://www.benlcollins.com/spreadsheets/google-sheet-web-scraper/)
