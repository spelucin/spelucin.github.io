---
title: "XPath Para el SEO: Guía completa y usos"
date: 2023-06-12T22:22:45.154Z
description: Aprende a usar XPath para extraer data de sitios web de manera sistemática
summary: Guía para usar XPath para extraer data de sitios web de manera
  sistemática y enriquecer tus fuentes de datos SEO.
showSummary: true
slug: xpath-seo
tags:
  - web scraping
  - xpath
  - xml
---
Extraer data de sitios web es una de las cosas a la que los SEOs nos enfrentamos todos los días. Pese a que esta tarea puede ser tan simple como copiar y pegar, hoy quiero mostrarles una manera más sistemática de ejecutarla usando el lenguaje de consultas XPath.

Al final de este post, comprenderás cómo usar XPath para encontrar y extraer data de cualquier sitio web y complementar las fuentes de datos que ya utilizas en tu día a día como SEO.

## ¿Qué es el lenguaje XPath?

En términos simples, XPath (XML Path Language) es un lenguaje de consulta que permite navegar y extraer el contenido de documentos HTML y XML. La principal razón por la que este lenguaje es importante es porque nos ayuda a extraer el contenido de una web de manera sistemática y replicable, ahorrándonos horas de trabajo manual. Además, es un lenguaje que se hace entender de manera rápida una vez se conoce la sintaxis.

### ¿Cómo se relaciona XPath con el SEO?

Existen muchas tareas en el posicionamiento web que requieren extraer data de sitios web para analizarlos y sacar conclusiones de ellos. Ya sea nuestra propia web o la de los competidores, se hace aparente la necesidad de extraer esta información en orden.

Tomemos como ejemplo un comercio electrónico. Podemos usar esta [página de producto de Lazy Oaf](https://www.lazyoaf.com/products/lazy-cat-jumper) como ejemplo para este ejercicio. La expresión XPath para extraer el nombre del producto sería:

```xquery
//*[@class="product-main__information"]/h1
```

Si evaluamos la expresión XPath usando la [extensión de Chrome XPath Helper](https://chrome.google.com/webstore/detail/xpath-helper/hgimnogjllphhhkhlmebbmlgjoejdpjl), observamos que nos devuelve el título del producto:

![Ejemplo de una expresión XPath evaluada en la web de Lazy Oaf](/img/xpath-helper-chrome.png)

Ahora, imagina aplicar esto a escala: tanto como para 100 o 200.000 páginas, para más de un elemento y alinear la data extraída con otras fuentes de datos cómo Google Search Console o Ahrefs.

Para sacarle el jugo a XPath, es importante tener un conocimiento sólido de la sintaxis. Así, empezaremos a construir nuestras propias consultas y extraer lo que queramos de cualquier sitio web.

## Sintaxis del lenguaje XPath

### Estructura de nodos en HTML y XML

Antes de entender como extraer contenido usando XPath, es necesario comprender la estructura de los documentos XML y HTML. En el ejemplo de abajo, vemos un documento XML estándar tomado de \[https://www.w3schools.com/xml/xpath_syntax.asp](la web de W3Schools).

```xml
<?xml version="1.0" encoding="UTF-8"?>

<bookstore>

<book>
  <title lang="en">Harry Potter</title>
  <price>29.99</price>
</book>

<book>
  <title lang="en">Learning XML</title>
  <price>39.95</price>
</book>

</bookstore>
```

De igual manera, tenemos un documento HTML con una estructura completa:

```html
<!DOCTYPE html>
<html>
    <head>
      <title>Mi página web</title>
      <link rel="canonical" href="https://miweb.com/pagina/" />
    </head>
    <body>
      <article>
        <h1 class="heading-general" id="fist-heading">My First Heading</h1>
        <p class="first-paragraph">My first paragraph.</p>
        <p class="second-paragraph">My first paragraph.</p>
      </article>
    </body>
</html>
```

Lo que tienen ambos formatos en común es que ambos poseen una estructura de árbol: un nodo (o etiqueta, en el caso de HTML) se ubica dentro de otro, formando un árbol de nodos. Existe una jerarquía entre nodos o etiquetas, de tal manera que la consulta XPath navega entre los nodos para ser resuelta.

Cada nodo tiene una serie de atributos. En el caso del archivo XML, podemos ver el atributo `lang` con el valor `en`, y en el caso del archivo HTML los atributos podrían corresponder a las clases y a los ID.

*Nota: en HTML esta estructura en forma de árbol se llama Document Object Model (DOM). EL DOM es una de las piedras angulares de la internet ;).*

### Navegando a través de HTML y XML con XPath

#### Seleccionado los nodos

Ahora que entendemos cómo funciona la estructura de árbol en HTML y XML, ya podemos empezar a navegarlos. Los tokens que nos ayudarán son:

| **Expresión**   | **Descripción**                                                                                                           | **Ejemplo** |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- |
| nodename        | Selecciona el nodo con el nombre "nodename".                                                                              | h1          |
| /               | Selecciona el nodo raíz.                                                                                                  | /h1         |
| //              | Selecciona un nodo desde la raíz del documento, sin importar donde esté.                                                  | //article   |
| /nodename/child | Selecciona todos los elementos de nombre "child" que se encuentren debajo de "nodename", sin importar donde se encuentren | /div/h1     |
| //@atributo     | Selecciona todos los atributos llamados "atributo"                                                                        | /﻿/@href    |

En el ejemplo HTML, si quisiéramos seleccionar el nodo que corresponde al `h1`con la clase `heading-general`, tendríamos que escribir la siguiente consulta:

```xquery
//h1[@class='heading-general']
```

Esto nos devolverá (dependiendo de la aplicación y de lo específico que seamos), el HTML interno del elemento seleccionado, el texto interior o el valor del atributo.

#### Predicates

Los predicates de XPath sirven para encontrar un nodo específico o un valor específico dentro de un set de nodos. Aquí es donde la cosa se pone interesante, ya que con los predicates nos permiten construir consultas más avanzadas y precisas. Los predicates más útiles son:

| Expresión                  | Descripción                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| //title\[@lang]            | Selecciona el primer elemento de libro que es hijo del elemento "librería"                 |
| //title\[@lang='en']       | Selecciona todos los elementos de título que tienen un atributo "lang" con un valor de "en |
| /bookstore/book\[1]        | Selecciona el primer elemento de libro que es hijo del elemento "bookstore"                |
| /bookstore/book\[last()]   | Selecciona el último elemento de libro que es hijo del elemento "bookstore".﻿              |
| /bookstore/book\[last()-1] | Selecciona el penúltimo elemento de libro que es hijo del elemento "bookstore              |

Existen algunos predicates más, pero no los he dejado aquí porque no son muy útiles con archivos HTML. Puedes ver la lista de predicates completos en la [página de W3Schools sobre la sintaxis de XPath](https://www.w3schools.com/xml/xpath_syntax.asp).

Ya nos estamos acercando más a la consulta de ejemplo, en el que se extrae un nodo usando su clase CSS junto a las etiquetas que le corresponden ¡Buen trabajo!

#### Funciones y wildcards

XPath tiene algunas funciones muy útiles para procesar la data extraída, así como tokens que sirven de wildcards. Los más útiles a nivel de extracción de data para SEO son:

##### Funciones

| Función       | Descripción                                                                                                                           | Ejemplo                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| contains()    | Determina si la primera cadena de argumentos contiene la segunda cadena de argumentos y devuelve un valor booleano verdadero o falso. | //a\[contains(.,’clic aquí’)]/@href                  |
| count()       | Cuenta el número de nodos en un conjunto de nodos y devuelve un número entero.                                                        | count(//h3)                                          |
| starts-with() | Comprueba si la primera cadena comienza con la segunda cadena y devuelve verdadero o falso.                                           | //meta\[starts-with(@property, ‘og:title’)]/@content |

##### Wildcards

| Token | Descripción                                       | Ejemplo                     |
| ----- | ------------------------------------------------- | --------------------------- |
| \*    | Cualquier elemento. Funciona como comodín general | //*\[@class="mi-clase"]     |
| @*    | Cualquier atributo.                               | //div\[@*]                  |
| \|    | Operador "O" (para usar más de una expresión).    | (//a/text() \| //a/img/@alt) |

¡Genial! Ya estás listo para armar tus propias consultas XPath y extraer data de la web 🎊🎊.

## Usando XPath en Screaming Frog

Antes de terminar este post, quería mostrar como usar este conocimiento de expresiones XPath para aplicarlo a un caso real.

Screaming Frog es uno de los crawlers más usados (si no el más usado) de la industria SEO. Una de las mejores características que tiene es que se le puede usar como un scraper web, es decir, se puede extraer contenido de manera sistemática con él. Para este ejemplo, extraeremos atributos del [sitio de Lazy Oaf](https://lazyoaf.com).

Para empezar a extraer información de manera personalizada, iremos a "Configuración > Personalizado > Extracción personalizada". Se nos mostrará la siguiente ventana:

![Extracción personalizada en Screaming Frog](/img/screaming-frog-extraccion-personalizada.png)

En ella, haremos clic en "Añadir". Nos aparecerá una nueva fila en la parte central de la ventana:

* La primera casilla corresponde al nombre del extractor. Este nombre es el que tendrá la fila dentro de la interfaz de Screaming Frog.
* El tipo de selector nos permite escoger si deseamos usar XPath, expresiones regulares o selectores de CSS. En este caso, lo dejaremos en XPath.
* En el siguiente campo colocaremos la expresión XPath que hemos creado. La "X" roja cambiará a un check verde si la expresión es válida.
* En la última, decidiremos el tipo de extractor:

  * "HTML interno" nos devuelve las etiquetas que están dentro del elemento que se selecciona mediante XPath.
  * "Extraer texto" nos devuelve el texto crudo (sin HTML) que corresponde al elemento seleccionado.
  * "Extraer elemento HTML" nos dará la etiqueta completa, con todas sus clases, IDs y demás atributos.
  * "Valor de función" solo sirve si vas a usar una función como las de arriba ;).

Volviendo al sitio web de Lazy Oaf, extraeremos todos los nombres de producto y precios que tienen sus páginas de producto. Mi flujo preferido para escribir una consulta XPath es el de abrir las DevTools de Chrome y emplear el inspector con el mouse (Ctrl + Shift + C) para seleccionar el posible elemento a extraer.

![Consultando la estructura de la web de LazyOaf](/img/chrome-devtools-lazyoaf.com.png)

Una vez abierto, no solo basta con observar la etiqueta del elemento que queremos extraer, también debemos observar las etiquetas que le rodean. Observamos que existe una etiqueta `<div>` con la clase `product-main__information`. Podemos emplear esta información de la siguiente manera para crear el XPath del elemento:

```xquery
//div[@class='product-main__information']/h1
```

Incluimos la etiqueta `<div>` en caso existan otros H1 en la página. Evaluando la expresión XPath, obtenemos:

![Obteniendo el título del producto mediante XPath en la página de Lazy oaf](/img/xpath-helper-lazy-oaf-title.png)

Para el precio, tomamos una ruta similar: buscamos entre las etiquetas de la página, armamos la expresión y la evaluamos con XPath Helper. La expresión que usaremos es:

```xquery
//div[@class="product-price__price-container"]/span
```

Al evaluar la expresión, esto nos devuelve:

![Obteniendo el precio del producto mediante XPath en la página de Lazy Oaf](/img/xpath-helper-lazy-oaf-price.png)

Ahora que tenemos dos expresiones XPath, las llevaremos a Screaming Frog usando la ventana de "Extracción personalizada". Una vez que tenemos ambos selectores configurados, podemos rastrear la web o su mapa de sitio. En mi caso, decidí rastrear el sitemap de productos.

Una vez que empezamos a correr el crawl, la pestaña "Extracción Personalizada" se empezará a popular con la data que le acabamos de pedir mediante las consultas XPath.

![Data del sitio web de Screaming Frog extraída con XPath](/img/screaming-frog-extraccion-personalizada-lazy-oaf.png)

Hemos logrado emplear el lenguaje de consultas XPath para extraer data de un sitio web, sin tener que gastar horas en trabajo manual.

## Lecturas adicionales

1. [XPath - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/XPath)
2. [Expresiones Xpath para SEO - LaikaTeam](https://laikateam.com/blog/expresiones-xpath-seo/)
3. [An SEO's guide to XPath - Builtvisible](https://builtvisible.com/seo-guide-to-xpath/)
4. [XPath Tutorial - W3 Schools](https://www.w3schools.com/xml/xpath_intro.asp)