# SEO

Sitio en español (`lang="es-CO"`). Páginas estáticas, sin JS por defecto, pensadas para Lighthouse alto. Cada landing lleva la calculadora embebida (isla) y un texto que explica la norma.

## URLs

| Ruta                               | Intención                                               |
| :--------------------------------- | :------------------------------------------------------ |
| `/`                                | Calculadora reforma tributaria 2026: ¿cuánto te afecta? |
| `/salario-neto-reforma-tributaria` | Salario neto                                            |
| `/impuesto-de-renta-2027`          | Renta 2027                                              |
| `/retencion-en-la-fuente-reforma`  | Retención                                               |
| `/iva-alimentos-2028`              | IVA alimentos                                           |
| `/compras-temu-shein-iva`          | Compras internacionales                                 |
| `/devolucion-iva-efectiva`         | EfectIVA                                                |
| `/ley-de-rescate`                  | Nombre alterno                                          |
| `/ley-de-financiamiento-2026`      | Nombre alterno                                          |
| `/proyecto-de-ley-477-de-2026`     | El proyecto                                             |
| `/preguntas-frecuentes`            | FAQ                                                     |
| `/glosario`                        | Glosario                                                |

## Términos

reforma tributaria, ley de rescate, ley de financiamiento 2026, proyecto de ley 477, retención en la fuente, UVT 2026, EfectIVA, IVA alimentos 2028, Temu Shein IVA.

## Cómo añadir una landing

1. Crea `src/pages/<slug>.astro` usando `src/layouts/Layout.astro`.
2. `title` y `meta description` propios; canonical cuando exista dominio.
3. Embed de la isla de calculadora que corresponda; el resto del artículo en HTML/Markdown, sin JS.
4. Datos estructurados cuando el artículo esté listo: `WebApplication`, `FAQPage`, `BreadcrumbList`, `Article` con `dateModified`.
5. El sitemap (`@astrojs/sitemap`) y las OG images de build se añaden en un PR posterior. `robots.txt` y Search Console también.

Un subdominio `*.workers.dev` sirve para el lanzamiento; un dominio propio mejora el CTR.
