import React, { useMemo, useState, useEffect } from "react";
import { Search, Play, Users, CloudLightning, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";

// ------------------------------------------------------------
//  BITÁCORA RAMO DEPORTIVO – SPA ESTÁTICA CON REACT + TAILWIND
// ------------------------------------------------------------
//  ✏️ Cómo editar los contenidos:
//  1) Busca más abajo las constantes `APLAUSOS_DATA`, `DINAMICAS_DATA` y `JUEGOS_DATA`.
//  2) Cada actividad tiene: id, title, description, tags (array), videoUrl (opcional).
//  3) Agrega o edita elementos. Para YouTube, pega la URL normal (ej. https://youtu.be/..).
//  4) Guarda y listo. Para publicar, mira "INSTRUCCIONES DE PUBLICACIÓN" al final.
// ------------------------------------------------------------

// Utilidad: convierte URL de YouTube a URL embebible

const TAGS_ALLOWED = ["individual", "parejas", "grupal"];

function sanitizeTags(tags = []) {
  return tags
    .map((t) => (t || "").toLowerCase().trim())
    .filter((t) => TAGS_ALLOWED.includes(t));
}

function tagClass(t) {
  const k = (t || "").toLowerCase();
  if (k === "individual") return "bg-blue-100 text-blue-800";
  if (k === "parejas") return "bg-amber-100 text-amber-800";
  if (k === "grupal") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-800";
}

function toYoutubeEmbed(url) {
  try {
    if (!url) return null;
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function ClapEmojiIcon({ className = "h-5 w-5" }) {
  return <span className={className} aria-hidden>👏</span>;
} 

function SparklesEmoji({ className = "h-5 w-5" }) {
  return <span className={className} aria-hidden>✨</span>;
} 

function GamesEmoji({ className = "h-5 w-5" }) {
  return <span className={className} aria-hidden>🏃‍♂️‍➡️</span>;
} 



function VideoPlayer({ url }) {
  if (!url) return null;
  const yt = toYoutubeEmbed(url);
  if (yt) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm">
        <iframe className="w-full h-full" src={yt} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    );
  }
  const isMP4 = url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
  if (isMP4) {
    return (
      <video className="w-full rounded-xl" controls>
        <source src={url} />
        Tu navegador no soporta video embebido.
      </video>
    );
  }
  return null;
}

// ----------------------------
//  DATOS (EDITA AQUÍ)
// ----------------------------

const APLAUSO_LLUVIA_DESC = `El objetivo de este aplauso individual es representar, a través de sonidos con las manos, las distintas intensidades de la lluvia. Cada persona lo realiza de manera independiente, comenzando con un dedo que golpea suavemente la palma, lo que simboliza la garuga o llovizna ligera. Luego se continúa con dos dedos, que representan una lluvia suave, para después pasar a tres dedos que evocan una lluvia moderada. Al sumar cuatro dedos, el sonido se intensifica y se asemeja a una lluvia fuerte, hasta llegar finalmente al aplauso completo con toda la palma, que representa la tormenta. Tras alcanzar este punto máximo, el aplauso se desarrolla en sentido inverso: de la tormenta se retrocede a la lluvia fuerte, luego a la moderada, después a la suave y finalmente a la garuga, reflejando cómo la lluvia disminuye poco a poco hasta desaparecer.`;

// Generador de placeholders legibles
const makePlaceholders = (prefix, count, tag = "individual") =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix[0].toUpperCase() + prefix.slice(1)} ${i + 1}`,
    description: "Completar con explicación de la actividad (objetivo, pasos y cierre).",
    tags: [tag],
    videoUrl: "",
  }));

const APLAUSOS_DATA = [
  {
    id: "ap-coordinado",
    title: "Aplauso Coordinado",
    tags: ["grupal"],
    videoUrl: "",
    description: `El objetivo de este aplauso grupal es lograr la coordinación y la participación conjunta de todos los integrantes. Para comenzar, el profesor o encargado da la señal diciendo “ya”, tras lo cual el grupo debe aplaudir al mismo tiempo. En una segunda instancia, se aumenta la dificultad realizando dos aplausos consecutivos después de la señal. Posteriormente, se incorpora una variación en la que, en lugar de aplaudir, el grupo debe gritar “Wooooh” luego del “ya” del profesor. Finalmente, se integran todas las etapas: cuando el profesor dé la señal, el grupo debe ejecutar un aplauso, luego dos, y terminar con el grito “Wooooh”.`
  },
  {
    id: "ap-hora-te",
    title: "Hora de Té",
    tags: ["grupal"],
    videoUrl: "",
    description: `El objetivo de este aplauso es fomentar la cooperación y coordinación mediante la participación conjunta de todos los presentes. El profesor actúa de guía, marcando el ritmo de los aplausos del grupo mediante una canción. Esta va de la forma: “Hora de té, de té, de té. Hora de té, de té, de té. Hora de té, té”. Los alumnos deberán seguir el compás de la canción con aplausos coordinados, finalizando con un aplauso fuerte en el último “té”.`
  },
  {
    id: "ap-geometrico",
    title: "Geométrico",
    tags: ["grupal"],
    videoUrl: "",
    description: `El monitor comienza enseñando el ritmo básico del aplauso, similar al mostrado en el primer video, donde se repite un patrón regular. Después de dominarlo, se incorporan cambios introduciendo pausas o espacios entre los aplausos, como se observa en los otros videos con una y dos pausas. Estas variaciones exigen mayor concentración y precisión en la coordinación del grupo. 
Tiene como objetivo estimular la coordinación rítmica, la atención auditiva y el control motor mediante un patrón de aplausos que incorpora pausas, favoreciendo además la sincronización grupal y la ejecución precisa de secuencias. 
No requiere materiales.`
  },
  {
    id: "ap-sombrero",
    title: "Aplauso del Sombrero",
    tags: ["grupal"],
    videoUrl: "",
    description: `El objetivo de este aplauso es trabajar la atención sostenida y la sincronización grupal mediante una señal visual dinámica. El monitor lanza un gorro al aire y, mientras este permanece en vuelo, todos los participantes deben aplaudir de forma continua, deteniéndose únicamente cuando el monitor lo atrape nuevamente. Se pueden realizar varias rondas variando la altura o velocidad del lanzamiento para aumentar la dificultad. No requiere más que un gorro u objeto liviano.`
  },
  {
    id: "ap-tren",
    title: "Aplauso del Tren",
    tags: ["grupal"],
    videoUrl: "",
    description: `El objetivo de este aplauso es fomentar la coordinación grupal a través de la imitación de los sonidos de un tren. Para ello, mientras el encargado mantenga la mano abierta, el grupo debe reproducir el sonido “ch-ch-ch-ch”. Si el encargado hace la seña de tocar la bocina, todos deben responder con un “uouuuu”, imitando el silbato del tren. Finalmente, si se indica una señal de frenado, el grupo debe reproducir un sonido agudo de frenado, como “iiiii”.`
  },
  {
    id: "ap-estadio",
    title: "Estadio",
    tags: ["grupal"],
    videoUrl: "",
    description: `El objetivo de este aplauso es fomentar la coordinación y controlar la sensibilidad de los aplausos ejecutados como grupo. Para esto, se establecen tres categorías de público en un estadio, que los alumnos deberán replicar: palco, tribuna y galucha. Cada una representa una intensidad de aplauso creciente respectivamente.

                  Palco → aplausos suaves y lentos.  
                  Tribuna → aplausos más intensos e intermedios.  
                  Galucha → aplausos fuertes acompañados de gritos y entusiasmo.

                  El profesor estará a cargo de controlar el ritmo de la actividad, indicando cuándo el grupo deberá hacer cada tipo de aplauso.`
  },
  {
    id: "ap-lluvia",
    title: "Lluvia",
    tags: ["individual"],
    videoUrl: "",
    description: `El objetivo de este aplauso individual es representar, a través de sonidos con las manos, las distintas intensidades de la lluvia. Comienza con un dedo que golpea suavemente la palma, lo que simboliza la garuga. Luego se continúa con dos dedos, que representan una lluvia suave, para después pasar a tres dedos que evocan una lluvia moderada. Al sumar cuatro dedos, el sonido se intensifica y se asemeja a una lluvia fuerte, hasta llegar finalmente al aplauso completo con toda la palma, que representa la tormenta. Tras alcanzar este punto, el aplauso se desarrolla en sentido inverso: de la tormenta se retrocede a la lluvia fuerte, luego a la moderada, después a la suave y finalmente a la garuga, reflejando cómo la lluvia disminuye poco a poco hasta desaparecer.`
  },
  {
    id: "ap-domino",
    title: "Dominó",
    tags: ["grupal"],
    videoUrl: "",
    description: `En círculo y en cuclillas, parte aplaudiendo un compañero mientras cae a su derecha, generando un “efecto dominó” a medida que el aplauso corre entre el grupo.`
  },
  {
    id: "ap-metralleta",
    title: "Metralleta",
    tags: ["grupal"],
    videoUrl: "",
    description: `En este aplauso se debe separar el grupo en dos equipos. La persona que lo esté organizando debe marcar tiempos, los cuales son:

    Preparen: el equipo atacante debe hacer un sonido de recarga de escopeta “ch ch”, simbolizándolo con las manos.  
    Apunten: el equipo atacante apunta al otro equipo, simulando sostener una escopeta.  
    Fuego: el equipo atacante debe simbolizar que disparan y el otro equipo debe caerse al suelo.`
  },
  {
    id: "ap-animales",
    title: "Animales",
    tags: ["grupal"],
    videoUrl: "",
    description: `Del perro:  
    "paraparapám, guau guau guau, paraparapám guau guau guau, paraparapám, paraparapám, psss (levanto patita) guau"

    Del pato:  
    "paraparapám, kuak kuak kuak, paraparapám, kuak kuak kuak, paraparapám, paraparapám, puumm (disparo), kue kue kue (pato caído)"`
  },
  {
  id: "ap-globo",
  title: "Aplauso del Globo",
  tags: ["grupal"],
  videoUrl: "",
  description: `El profesor debe inflar un globo sin hacerle el nudo. Cuando lo suelta, los alumnos deben aplaudir rápido hasta que el globo se desinfle por completo.`
},
{
  id: "ap-popeye",
  title: "Popeye",
  tags: ["grupal"],
  videoUrl: "",
  description: `El objetivo de este aplauso es fomentar la coordinación rítmica y la sincronización grupal. Consiste en replicar el ritmo de la conocida canción de “Popeye”. Para ello, el grupo realiza una serie de aplausos rápidos y coordinados, seguidos por llevarse una mano a la boca simulando tocar una pipa o silbato y diciendo “tu-tu”. Esta secuencia se repite 2 veces. Para finalizar, se ejecuta la melodía completa de la canción con más aplausos rápidos, cerrando todos juntos nuevamente con el gesto de pipa y un “tu-tu” final.`
},
{
  id: "ap-torero",
  title: "Torero",
  tags: ["grupal"],
  videoUrl: "",
  description: `El aplauso torero consiste en que una persona tendrá en su mano un pañuelo (o algún otro objeto que simule el pañuelo, como un peto) y mientras esta persona lo agite por sobre la cabeza o por debajo de la cadera, el resto tendrá que aplaudir. 

Ahora bien, cuando la persona con el pañuelo cruce este de arriba a abajo de manera diagonal (como los toreros), los demás gritarán “OLEE”, cada vez que se cruce el pañuelo. Además, la persona con el pañuelo puede hacer el gesto de que lo “toreen” por la espalda, y el resto debe imitar el movimiento y sonido.`
},
{
  id: "ap-ola-marina",
  title: "Aplauso Ola Marina",
  tags: ["grupal"],
  videoUrl: "",
  description: `El objetivo de este aplauso es fomentar la coordinación grupal y la conciencia espacial. Los participantes se ubican en círculo o en filas. Cuando el profesor dé la señal, la persona más a la izquierda inicia la “ola”, levantando ambos brazos y dando un aplauso fuerte. Inmediatamente, la persona contigua debe repetir el aplauso, creando un efecto de ola que recorre al grupo. 

Luego, la ola regresa en sentido contrario, esta vez con un aplauso más suave. Para finalizar, todos deben levantar los brazos y aplaudir fuerte al mismo tiempo, imitando la llegada de una ola gigante.`
},
{
  id: "ap-popcorn",
  title: "Aplauso Popcorn",
  tags: ["grupal"],
  videoUrl: "",
  description: `El objetivo de este aplauso es promover la atención y la reacción rápida. El profesor comenzará diciendo “¡Pop!”, y los estudiantes deberán responder con un aplauso corto. Al aumentar a “¡Pop-pop!”, se debe responder con dos aplausos rápidos. 

Posteriormente, el profesor dirá “¡Aceite!”, y los alumnos deberán frotarse las manos para simular el calentamiento. 

Cuando el profesor diga “¡Explosionó!”, los estudiantes harán tres aplausos rápidos y un salto pequeño.`
},
{
  id: "ap-semaforo",
  title: "Aplauso Semáforo",
  tags: ["grupal"],
  videoUrl: "",
  description: `El objetivo es desarrollar control y autorregulación mediante el uso de señales visuales. El profesor utiliza tres colores: 

🟢 Verde: los alumnos aplauden fuerte y rápido.  
🟡 Amarillo: el aplauso se vuelve suave y lento.  
🔴 Rojo: todos deben quedar en silencio, con las manos juntas.  

El profesor puede alternar rápidamente entre los colores para aumentar la dificultad. 

En la ronda final, los estudiantes cierran los ojos y siguen las señales únicamente por indicaciones verbales: “verde”, “amarillo”, “rojo”.`
},
{
  id: "ap-eco",
  title: "Aplauso Eco",
  tags: ["grupal"],
  videoUrl: "",
  description: `El objetivo es trabajar atención auditiva y coordinación. El profesor realiza una secuencia de aplausos con distintos ritmos (por ejemplo: fuerte, fuerte, suave) y el grupo debe repetirla exactamente como un eco. 

A medida que avanza, las secuencias se vuelven más largas o rápidas.`
},
{
  id: "ap-castillo",
  title: "Aplauso Castillo",
  tags: ["grupal"],
  videoUrl: "",
  description: `El objetivo es fomentar atención y memoria. Los alumnos se colocan en filas que representan los “pisos” de un castillo. 

• Primer piso (primera fila, agachados): aplauso simple  
• Segundo piso (segunda fila, parados): doble aplauso  
• Torre (círculos de personas a ambos costados de las filas): aplauso con palmas arriba  

Cada piso debe ejecutar el aplauso indicado a medida que el profesor los indique. Para finalizar, todos los pisos combinan sus aplausos de manera simultánea.`
},
{
  id: "ap-posta",
  title: "Aplauso Posta",
  tags: ["grupal"],
  videoUrl: "",
  description: `Este aplauso tiene como objetivo fomentar la coordinación y la atención de todos los participantes. Los alumnos se ubican formando un círculo, y uno de ellos inicia la actividad dando un aplauso. La persona a su derecha continúa con otro aplauso, y así sucesivamente, siguiendo la secuencia alrededor del círculo. 

Si algún participante da dos aplausos consecutivos, la dirección del aplauso se invierte y la secuencia continúa en sentido contrario. 

Por otro lado, si alguien en lugar de aplaudir muestra la palma de la mano, se salta a la siguiente persona, quien debe continuar el aplauso.`
},
{
  id: "ap-7",
  title: "Aplauso del 7",
  tags: ["grupal"],
  videoUrl: "",
  description: `El Aplauso del 7 busca fomentar la atención y la rapidez de reacción de los participantes. Los alumnos se colocan en círculo y comienzan a contar en voz alta de manera consecutiva, iniciando desde el número 1. Cada participante debe decir el número que le corresponde siguiendo la secuencia. 

Cuando el número que corresponde es 7, un múltiplo de 7 o contiene el dígito 7, la persona que le toca no dice el número, sino que debe aplaudir. 

Además, si algún participante aplaude dos veces seguidas, la secuencia de números cambia de dirección, pasando a continuar en sentido contrario.`
},
{
  id: "ap-chocolate",
  title: "Chocolate",
  tags: ["grupal"],
  videoUrl: "",
  description: `Esta actividad consiste en acompañar una canción con distintos movimientos de manos. 
La canción es: 
“Choco choco la la, 
choco choco te te, 
choco la, 
choco te, 
choco la te.”

Las acciones se realizan según la palabra que suene:
• “Choco” → chocar las manos abiertas con otra persona.  
• “La” → aplaudir.  
• “Te” → chocar los puños.  

La actividad continúa siguiendo el ritmo de la canción. Se puede repetir varias veces, acelerando progresivamente para aumentar la dificultad y el entusiasmo del grupo.`
},
{
  id: "ap-locos-addams",
  title: "Los Locos Addams",
  tags: ["grupal"],
  videoUrl: "",
  description: `Este aplauso grupal replica el ritmo clásico de Los Locos Addams, combinando golpes corporales y chasquidos/aplausos en una secuencia que se repite constantemente. El aplauso sigue el ritmo pegadizo de la canción original (un ritmo de 8 tiempos) y la secuencia utiliza palmadas en los muslos y chasquidos de dedos.

El patrón rítmico que debe seguir el grupo es:

Primera secuencia:
Palmada + Palmada + Palmada + Palmada (2 por cada muslo) → Chasquido + Chasquido

Segunda secuencia (repetición):
Palmada + Palmada + Palmada + Palmada (2 por cada muslo) → Chasquido + Chasquido

Tercera secuencia:
Palmada + Palmada + Palmada + Palmada (2 por cada muslo) → 
Palmada + Palmada + Palmada + Palmada (2 por cada muslo) → 
Chasquido + Chasquido

El objetivo es lograr sincronización y precisión rítmica grupal a alta velocidad utilizando todo el cuerpo. No requiere materiales.`
},
{
  id: "ap-pecho-clip-mano",
  title: "Pecho Clip Mano",
  tags: ["grupal"],
  videoUrl: "",
  description: `Se enfoca en la coordinación de gestos corporales y percusión rítmica a gran velocidad. Se realiza como ejercicio de calentamiento, rompehielos o para reactivar la energía grupal. 

El juego sigue un patrón rítmico fijo de 7 movimientos que se repite:
Pecho (golpe), Clip (chasquido), Mano (aplauso),
Pecho, Clip, Pecho, Mano.

El objetivo es desarrollar velocidad de reacción motora, precisión rítmica y sincronización bajo una secuencia compleja y fija. No requiere materiales.`
},
{
  id: "ap-tenis",
  title: "Tenis",
  tags: ["grupal"],
  videoUrl: "",
  description: `Esta actividad consiste en replicar, mediante aplausos sincronizados, el ritmo de un partido de tenis que se juega en vivo frente al grupo. El objetivo es entrenar la concentración auditiva y la rapidez de reacción.

Roles:
• Jugadores (2): simulan un partido con raquetas imaginarias. Cada golpe marca el tiempo del aplauso del público.
• Público: aplaude exactamente cuando uno de los jugadores "golpea" la pelota.

Desarrollo:
• Comienzo lento: golpes lentos y predecibles.  
• Aumento de velocidad: rallies más rápidos e intensos.  
• Desafío final: máximo ritmo posible sin perder sincronía.  

Si un jugador falla o el grupo se descoordina, el aplauso se detiene.`
},
{
  id: "ap-del-caballo",
  title: "Del Caballo",
  tags: ["grupal"],
  videoUrl: "",
  description: `Actividad enfocada en el ritmo constante, la concentración auditiva y la coordinación. El grupo mantiene un ritmo base de galope: golpes rápidos y continuos en los muslos.

Comandos del líder:
• ¡Izquierda!: el grupo se inclina o da un paso a la izquierda.  
• ¡Derecha!: inclinación o paso a la derecha.  
• ¡Salto!: todo el grupo salta levantando las manos.  
• ¡Vuelvo!: retorno inmediato al galope base.

La clave es la reacción instantánea al comando y volver al ritmo base sin perder coordinación.`
},
{
  id: "ap-el-chavo",
  title: "El Chavo",
  tags: ["grupal"],
  videoUrl: "",
  description: `Basado en el ritmo de la canción principal de El Chavo del 8, utilizando golpes en el cuerpo, aplausos y pasos rítmicos. El patrón fijo es:

• Golpes en los muslos (4 tiempos): rápidos e inclinados.  
• Aplausos (4 tiempos): fuertes y sincronizados.  
• Marcha rítmica (8 tiempos): pasos rápidos alternados o un bamboleo corporal de 8 tiempos.

El objetivo es coordinar golpes, aplausos y pasos en un ritmo rápido y constante, manteniendo precisión en los cambios.`
},
{
  id: "ap-camaleon",
  title: "Camaleón",
  tags: ["grupal"],
  videoUrl: "",
  description: `Actividad que desarrolla atención visual, velocidad de reacción y capacidad de imitación. Un líder se ubica adelante y cambia rápidamente el estilo del aplauso o gesto de percusión, manteniendo siempre un ritmo base constante.

El grupo debe:
• Observar al líder sin perderlo de vista.  
• Copiar al instante cada cambio de gesto o movimiento.  

Es un ejercicio de mímica y coordinación fina bajo la presión de un ritmo continuo. No requiere materiales.`
},
{
  id: "ap-fuerte-aplauso",
  title: "Fuerte el Aplauso",
  tags: ["grupal"],
  videoUrl: "",
  description: `Actividad basada en reacción auditiva y sincronización exacta del aplauso con el final de un grito prolongado del líder.

Fase 1 – Tensión vocal:
El líder grita de forma sostenida (“Fuerte el aplaaaaaaausoooo…”). El grupo permanece atento.

Fase 2 – Acción:
Cuando el líder termina la última sílaba (“…o!”), todos deben aplaudir exactamente en ese instante.

La actividad desarrolla atención auditiva, anticipación y precisión temporal. No requiere materiales.`
},
{
  id: "ap-hacha",
  title: "Aplauso del Hacha",
  tags: ["grupal"],
  videoUrl: "",
  description: `Tiene como objetivo trabajar sincronización y atención. Un integrante se ubica al centro del círculo y simula un golpe con un hacha imaginaria. Cada vez que el hacha “golpea” abajo, el grupo debe aplaudir de forma coordinada.

El golpe puede repetirse a diferentes velocidades, aumentando el desafío de reacción y sincronía.`
},
{
  id: "ap-sonido",
  title: "Aplauso Sonido",
  tags: ["grupal"],
  videoUrl: "",
  description: `Fomenta la coordinación y la capacidad de reacción. El grupo comienza en silencio, moviendo las manos como “jazz hands”.

Cuando el monitor grita “SONIDO”, todos comienzan a aplaudir rápidamente.  
Cuando vuelve el silencio, deben detener el aplauso y regresar a jazz hands.

El momento del cambio es completamente impredecible, por lo que exige atención constante.`
},
  ...makePlaceholders("Aplauso", 49),
];

const DINAMICAS_DATA = [
  {
    id: "aram-sam-sam",
    title: "Aram Sam Sam",
    tags: ["grupal"],
    description: `En esta actividad, los estudiantes se ponen de pie y acompañan la canción con una serie de movimientos coordinados. La letra es:

A Ram Sam Sam, A Ram Sam Sam
Guli Guli Guli Guli Guli Ram Sam Sam
A Ram Sam Sam, A Ram Sam Sam
Guli Guli Guli Guli Guli Ram Sam Sam

Arabi, arabi
Guli Guli Guli Guli Guli Ram Sam Sam
Arabi, arabi
Guli Guli Guli Guli Guli Ram Sam Sam

Durante la primera parte, realizan gestos hacia abajo simulando lluvia; en la sección de “Guli guli”, hacen toques suaves en la cara; y cuando aparece “Arabi”, levantan los brazos. Una vez dominado el patrón, se incorpora una versión en parejas, donde cada participante ejecuta los mismos gestos con su compañero, manteniendo el ritmo y favoreciendo la interacción grupal mientras la dinámica avanza.`,
    objetivo: `Trabajar la coordinación motriz, la expresión corporal y la habilidad de seguir secuencias rítmicas, promoviendo la atención, la cooperación y un contacto respetuoso entre los participantes.`,
    materiales: `No requiere materiales.`,
    variantes: `Versión en parejas donde se ejecutan los mismos gestos sincronizados.`
  },

  {
    id: "cazador-leon-escopeta",
    title: "Cazador, León y Escopeta",
    tags: ["grupal"],
    description: `La dinámica consiste en coordinar equipos mediante mímicas. El grupo se separa en dos equipos, y cada uno elige discretamente una de las tres opciones: cazador, león o escopeta. Luego, a la cuenta de tres, ambos equipos se dan vuelta mostrando su elección mediante una mímica.

Mímicas:
• Cazador: brazos cruzados con las manos en los hombros.  
• León: ambos brazos sobre la cabeza simulando garras.  
• Escopeta: se simula sostener una escopeta.

Reglas:
• Cazador domina a escopeta y pierde con león.  
• Escopeta gana al león y pierde con cazador.  
• León gana al cazador y pierde con la escopeta.

El equipo donde todos hagan la misma mímica y cuya elección domine a la del equipo contrario gana. Si ambos equipos hacen la misma mímica, hay empate y se repite.`,
    objetivo: `Fomentar el liderazgo, la coordinación de equipos y la toma rápida de decisiones.`,
    materiales: `No requiere materiales.`,
    variantes: `Se pueden agregar nuevas figuras o ampliar la jerarquía entre ellas.`
  },

  {
    id: "larai-lai-lero",
    title: "Larai lai lero",
    tags: ["grupal"],
    description: `Esta dinámica consiste en acompañar la canción:

“Larai lai lero,
Larai lai lero,
larai lai lero lero
lero lero lá”.

El objetivo es acompañar la canción con un movimiento coordinado de los dedos índices: hacia arriba, contraídos, horizontales y mirándose. La secuencia sigue estrictamente cada parte de la canción.

Además, existe una variante más compleja donde, en lugar de los dedos, se utilizan movimientos corporales:
• Índices hacia arriba → índice izquierdo en oreja derecha e índice derecho en la nariz.  
• Dedos contraídos → un aplauso.  
• Dedos horizontales → índice derecho en oreja izquierda e índice izquierdo en la nariz.`,
    objetivo: `Trabajar la coordinación fina, la concentración y la secuencia motriz sincronizada con la canción.`,
    materiales: `No requiere materiales.`,
    variantes: `Versión corporal sustituyendo los gestos de dedos por movimientos más complejos.`
  },

  {
    id: "noble-duque-juan",
    title: "El noble duque Juan",
    tags: ["grupal"],
    description: `El profesor canta la canción:

“El noble duque Juan,
tenía hombres mil,
subía la montaña,
y bajaba otra vez.
cuando sube sube sube,
cuando baja baja baja,
y en el medio del camino,
sube usted y bajo yo.”

La dinámica base consiste en que los alumnos estén sentados, poniéndose de pie cada vez que la letra dice “subir” y sentándose cuando indica “bajar”.`,
    objetivo: `Fomentar la coordinación grupal, la psicomotricidad y la capacidad de seguir instrucciones musicales.`,
    materiales: `No requiere materiales.`,
    variantes: `Realizar la lógica inversa (levantarse al bajar y sentarse al subir) o intercalar acciones por alumno.`
  },

  {
    id: "noe-arca",
    title: "Un día Noé, en su arca partió",
    tags: ["grupal"],
    description: `Los estudiantes cantan la canción:

“Un día Noé en su arca partió
y muchos animales de dos en dos subió.
Al son del cocodrilo y el orangután,
la pícara serpiente y el águila real,
el conejo, el topo y el elefante… loco loco eres tú.”

Cada parte de la canción se acompaña con gestos que representen a cada animal. En la palabra final “tú”, se señala a otro participante, quien debe repetir toda la secuencia.`,
    objetivo: `Estimular la expresión corporal, memoria auditiva, creatividad y el respeto por los turnos.`,
    materiales: `No requiere materiales.`,
    variantes: `Incorporar nuevos animales o permitir que cada alumno invente un gesto propio.`
  },

  {
    id: "evolucion",
    title: "Evolución",
    tags: ["grupal"],
    description: `Todos los participantes comienzan como “Amebas”. Para avanzar de nivel deben jugar cachipún con personas del mismo nivel.

Reglas:
• El ganador evoluciona al siguiente nivel.  
• El perdedor vuelve al nivel inicial.  
• Gana quien llegue a “Superestudiante de la Católica”.

Niveles y gestos:
• Ameba: movimientos ondulados con los brazos.  
• Cangrejo: manos en forma de pinzas, caminar de lado.  
• Conejo: manos sobre la cabeza como orejas.  
• Gorila: golpes suaves en el pecho.  
• Superestudiante: brazo extendido en señal de triunfo.`,
    objetivo: `Fomentar expresión corporal, resiliencia, interacción social y motivación por avanzar.`,
    materiales: `No requiere materiales.`,
    variantes: `Agregar más niveles intermedios o modificar las reglas de retroceso.`
  },

  {
    id: "hoyo-fondo-mar",
    title: "Hay un hoyo en el fondo de la mar",
    tags: ["grupal"],
    description: `Dinámica basada en la canción acumulativa que parte con:

“Hay un hoyo en el fondo de la mar...”.

Luego se agregan elementos en orden estricto:
palo → clavo → hilo → dedo → uña.

La versión final termina acumulando todas las palabras en orden, repitiendo progresivamente toda la estructura.`,
    objetivo: `Fomentar la memoria auditiva, el seguimiento secuencial y la coordinación grupal.`,
    materiales: `No requiere materiales.`,
    variantes: `Se pueden agregar objetos nuevos para aumentar la dificultad.`
  },

  {
    id: "tilin-tilon",
    title: "Tilín tilón osito regalón",
    tags: ["grupal"],
    description: `La dinámica sigue la canción:

“Tilín tilón,
osito regalón.
Tilín tilón,
osito regalón.
Tilín tilón,
te doy mi corazón.”

Gestos:
• “tilín tilón”: levantar índice derecho e izquierdo.  
• “osito regalón”: mecer brazos como cargando un bebé.  
• “te doy mi corazón”: formar corazón con las manos y expandirlo hacia afuera.`,
    objetivo: `Trabajar coordinación psicomotriz, ritmo y conexión afectiva grupal.`,
    materiales: `No requiere materiales.`,
    variantes: `Aumentar velocidad o realizar la secuencia por parejas.`
  },

  {
    id: "ay-llepo",
    title: "Ay llepo, wi tai tai llepo",
    tags: ["grupal"],
    description: `En parejas sentadas frente a frente, deben mover una pelotita siguiendo el ritmo de:

“Ay llepo,
wi tai tai llepo,
wi tubi tubi llepo,
wi tubi tubi yee-ee-po”.

Reglas:
• La pelota se deja en la mesa del compañero siguiendo el ritmo.  
• En “tubi tubi” se toca la mesa contraria y vuelve al origen.  
• Se puede aumentar la velocidad o agregar más participantes.`,
    objetivo: `Mejorar sentido rítmico, precisión y coordinación en parejas.`,
    materiales: `Una pelotita pequeña.`,
    variantes: `Incorporar más personas o mover múltiples pelotitas.`
  },

  {
    id: "cabeza-boca-mano-codo",
    title: "Cabeza, cabeza boca, mano codo",
    tags: ["grupal"],
    description: `Dinámica acumulativa donde cada palabra corresponde a una acción corporal: cabeza, boca, mano, codo, pie, rodilla, media vuelta, vuelta entera, medio salto, salto entero, medio paso, paso entero.

La secuencia se repite agregando progresivamente cada movimiento hasta hacerlos todos en orden.`,
    objetivo: `Desarrollar memoria motora, coordinación y ejecución rápida de secuencias corporales.`,
    materiales: `No requiere materiales.`,
    variantes: `Realizar la secuencia en orden invertido o aumentar la velocidad.`
  },
  {
  id: "yo-tengo-un-leon-grande-y-feroz",
  title: "Yo tengo un león grande y feroz",
  description: "Esta dinámica consiste en que una persona irá cantando la canción: “Yo tengo un león, muy grande y feroz, vive en un zoológico, tiene melena, y cola morena, y cuando se rasguña, se deja una uña”. En cada frase, el resto del grupo debe repetir el verso antes de avanzar al siguiente. Cada verso incluye un movimiento corporal asociado: mostrar garras, sacudir la melena, etc. La repetición continua exige atención y coordinación entre gesto y palabra.",
  objetivo: "Desarrollar la memoria auditiva, la coordinación entre gesto y palabra y la expresión corporal mediante la repetición de versos y movimientos asociados. Promueve la atención sostenida y la participación activa del grupo.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "el-dedo-gordo-se-mueve",
  title: "El dedo gordo se mueve",
  description: "Esta dinámica consiste en cantar una secuencia acumulativa donde se van nombrando distintas partes del cuerpo mientras se las mueve al mismo tiempo. Los versos incluyen: “el dedo derecho se mueve…”, “el dedo izquierdo se mueve…”, “la mano derecha…”, “la mano izquierda…”, “pie derecho…”, “pie izquierdo…”, “rodilla derecha…”, repitiéndose tres veces cada frase. A medida que avanza, los participantes deben mantener en movimiento todas las partes mencionadas previamente, acumulando acciones.",
  objetivo: "Trabajar la coordinación motriz global y activar al grupo de forma lúdica, promoviendo la atención y el seguimiento de instrucciones a través de secuencias acumulativas.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "el-chavo-del-8-dinamica",
  title: "El Chavo del 8",
  description: "Los participantes se colocan en círculo y posicionan sus manos alternando una arriba y otra abajo respecto a las manos de sus compañeros. Se canta: “Este es el juego del chavo del 8, muy divertido claro que sí, hay que contar del uno hasta el ocho, 1,2,3,4,5,6,7,8”. Durante la canción, cada persona cruza su mano que quedó arriba para chocar la mano del compañero correspondiente, generando una cadena rítmica. Quien recibe el choque en el número 8 debe sacar la mano rápidamente para no ser golpeado.",
  objetivo: "Favorecer la coordinación motriz y el trabajo rítmico en grupo mediante una secuencia sincronizada de movimientos. Desarrolla la atención, la rapidez de reacción y la interacción lúdica entre los participantes.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "pachi-patos",
  title: "Pachí (patos)",
  description: "Los participantes se organizan en tríos formando hileras. El profesor canta: “Ahí viene mamá pata (pachí). Ahí viene papá pato (pachí). Ahí vienen los patitos (pachí, pachí, pachí). Ten cuidado con los patitos, con los patitos no te metai”. Cada vez que aparece un “pachí”, el grupo debe gritar la palabra y dar un paso adelante con el mismo pie. Al llegar a la parte final, se camina al compás continuo de la canción hasta terminar.",
  objetivo: "Fomentar la coordinación grupal y psicomotriz, además de trabajar la reacción a estímulos auditivos y la sincronización rítmica.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "tengo-un-monton-de-ricos-cocos",
  title: "Tengo un montón de ricos cocos",
  description: "Los participantes forman un semicírculo mientras 2 personas están al centro. Se canta: “Tengo un montón de ricos cocos (ding ding ding), andan en fila míralos (bom bom bom). Grandes, chicos, feos y bonitos. Tengo un coco para ti.” Durante la canción, los del centro deben desplazarse aleatoriamente y reaccionar con acciones específicas: en “ding ding ding” flexionar rodillas; en “grandes” estirar brazos arriba; en “chicos” agacharse; en “feos y bonitos” poner manos en la cintura y mover caderas. Al decir “tengo un coco para ti”, deben elegir a alguien del semicírculo y apuntarlo para que se incorpore a la fila.",
  objetivo: "Estimular la expresión corporal, la memoria auditiva y la coordinación grupal mediante gestos asociados a la canción.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "palo-palito-palo-eh",
  title: "Palo palito palo eh",
  description: "Se canta: “Palo palo palo, palo palito palo eh, eh eh eh, palo palito palo eh”. Cada vez que se dice “palo”, se levantan ambas manos con el dedo índice arriba; cuando se dice “palito”, se levanta solo el dedo meñique; cuando aparece “eh”, se levanta el pulgar. La dinámica exige sincronizar movimientos finos con la letra.",
  objetivo: "Desarrollar la coordinación fina, la discriminación auditiva y la memoria rítmica mediante gestos precisos.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["individual"],
},

{
  id: "hercules",
  title: "Hércules",
  description: "El grupo recita movimientos acompañando las frases: “Juan es un Hércules” (levantar brazos mostrando músculos), “Mamá es sonámbula” (avanzar con brazos extendidos como zombi), “Papá no hace nada” (levantar brazos en signo de pregunta), “Se la lleva todo el día sentado en una silla” (flexionar rodillas simulando sentarse), “Jugando con el gato” (acariciar un gato imaginario), “Tirándole la cola” (gesto de tirar una cola).",
  objetivo: "Fomentar la expresión corporal y la coordinación grupal mediante mímicas simples asociadas a frases cantadas.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "piston",
  title: "Pistón",
  description: "Los participantes forman un círculo, alternando posiciones iniciales entre agachados y de pie. Se canta: “Es el pistón, el que hace andar a la máquina. Es el pistón, el que hace andar a vapor”. Cada vez que aparece la palabra “pistón”, quienes están de pie deben agacharse y quienes están agachados deben levantarse. Luego se repite la canción diciendo “pistón pistón”, y la cantidad se va aumentando progresivamente hasta que alguien falla.",
  objetivo: "Trabajar la atención, la velocidad de reacción y la coordinación grupal bajo cambios rápidos de posición.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "yo-tengo-un-gusano",
  title: "Yo tengo un gusano",
  description: "El grupo forma un círculo y el líder en el centro dice frases acompañadas de movimientos que los demás deben imitar. Ejemplo: “Yo tengo un gusano” (mostrar un gusano), “Levanto el gusano” (levantarlo), “Tiro el gusano” (lana al piso), “Recojo el gusano”, “Me como el gusano”, “Y lo chuuuuupo”, “Lo vomiiiiito”, “Lo abraaaaazo”. Siempre termina con: “¿Y el cuerpo? Relajao relajao relajao”, donde los participantes bailan relajadamente.",
  objetivo: "Desarrollar la imitación, la expresión corporal, la atención y la creatividad, manteniendo la coordinación grupal con secuencias guiadas.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "el-papa-de-abraham",
  title: "El papá de Abraham",
  description: "Los participantes comienzan poniendo un dedo sobre la boca simulando un bigote. Se canta: “El papá de Abraham, el papá de Abraham, tenía hijos, 7 hijos, que nunca jugaban, que nunca reían, y que solo hacían, como tú”. Al decir “como tú”, se apunta a alguien. En la siguiente ronda, la persona apuntada debe agregar un nuevo gesto para que el resto imite, manteniendo siempre el bigote inicial.",
  objetivo: "Trabajar la imitación, la creatividad, la expresión corporal y la atención grupal, incorporando gestos nuevos en cada ronda.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},
{
  id: "quien-le-robo-el-sombrero",
  title: "Quién le robó el sombrero al profesor",
  description:
    "Esta actividad se realiza con un grupo de gente. Se elige a una persona (persona 1) para comenzar, y el grupo entero entona el siguiente canto: “(Nombre de la persona 1) le robó el sombrero al profesor.” Persona 1 responde: “¿Quién, yo?”. El grupo dice: “Sí, tú”. Persona 1 responde: “Yo no fui”. El grupo pregunta: “¿Quién fue?”. Y la persona responde mencionando a otra persona del grupo. La dinámica continúa repitiendo el canto con cada nuevo nombre, avanzando de participante en participante hasta que todos hayan participado o el grupo decida finalizar.",
  objetivo:
    "Promover la atención, la participación activa, la memoria verbal inmediata y la interacción grupal mediante una dinámica de repetición y traspaso.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "head-shoulders-knees-and-toes",
  title: "Head, shoulders, knees and toes",
  description:
    "Esta actividad consiste en seguir una canción en inglés mientras se señala la parte del cuerpo mencionada. Las palabras y sus partes correspondientes son: Head (cabeza), Shoulders (hombros), Knees (rodillas), Toes (pies), Eyes (ojos), Ears (orejas), Mouth (boca), Nose (nariz). La canción completa es: “Head, shoulders, knees and toes, knees and toes. Head, shoulders, knees and toes, knees and toes. And eyes and ears and mouth and nose. Head, shoulders, knees and toes, knees and toes”. Cada vez que se nombra una parte del cuerpo, los participantes deben tocarla rápidamente siguiendo el ritmo.",
  objetivo:
    "Fomentar la coordinación corporal, el seguimiento auditivo y la discriminación motriz al identificar distintas partes del cuerpo bajo ritmo acelerado.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "suku-suku",
  title: "Suku Suku",
  description:
    "Dinámica rítmica donde los participantes forman un semicírculo y siguen una coreografía guiada por el profesor. El líder selecciona un grupo con alguna característica (por ejemplo, quienes juegan fútbol) y canta: “[Grupo seleccionado] van a bailar, charam la danza del suku suku (x2). Suku suku para adelante, suku suku para atrás (x2).” En “charam la danza del suku suku”, los seleccionados levantan ambas piernas estiradas como en tijeras. En “suku suku para adelante” dan pasos hacia adelante al ritmo, y luego hacia atrás en “suku suku para atrás”.",
  objetivo:
    "Estimular la coordinación grupal, la expresión corporal y el ritmo, además de promover la participación activa al seleccionar distintos grupos dentro del conjunto.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "mariposa",
  title: "Mariposa",
  description:
    "Actividad similar a la dinámica 'Chocolate', pero esta vez con movimientos de pies. La canción es: “Mari mari po po, Mari mari sasa, Mari po, Mari sa, Mari po sa”. Cada palabra corresponde a un salto distinto: “Mari” → saltar con piernas separadas; “Po” → saltar con piernas juntas; “Sa” → saltar en un solo pie. Se sigue el ritmo de la canción, pudiendo acelerar la velocidad para aumentar la dificultad.",
  objetivo:
    "Trabajar la coordinación motriz, la discriminación auditiva y la estabilidad corporal mediante saltos estructurados según estímulos verbales.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "hombro-hombre-goma",
  title: "El hombro del hombre de goma",
  description:
    "Actividad acumulativa donde se incorporan partes del cuerpo progresivamente mientras se repite una frase cada vez más larga. Se inicia tocando el hombro y diciendo: “El hombro del hombre de goma”. Luego se suma: “El brazo del hombro del hombre de goma”, tocando ambas partes en orden. El listado completo de partes a incorporar, en orden, es: hombro, brazo, codo, antebrazo, muñeca, mano, dedo, falange, falangina, falangeta. La frase final queda: “La falangeta de la falangina de la falange del dedo de la mano de la muñeca del antebrazo del codo del brazo del hombro del hombre de goma.”",
  objetivo:
    "Estimular la memoria secuencial, la coordinación corporal y la atención mediante una estructura acumulativa que se vuelve progresivamente más compleja.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["individual", "grupal"],
},

{
  id: "chapulin-colorado",
  title: "Chapulín Colorado",
  description:
    "Los participantes saltan siguiendo la canción: “Chapulín colorado, me hago pis o me aguanto”. Durante la canción se alternan saltos con piernas juntas y con piernas separadas. Al finalizar, quienes quedan con las piernas separadas deben correr simulando ir al baño porque 'se hicieron pis'. Luego regresan al círculo y se repite la dinámica.",
  objetivo:
    "Fomentar la coordinación motriz, la velocidad de reacción y el juego simbólico mediante movimientos simples y un cierre lúdico.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "bang",
  title: "Bang",
  description:
    "El grupo forma un círculo de pie. Una persona dice el nombre de alguien: esa persona debe agacharse rápidamente. Quienes están a su derecha e izquierda deben formar una pistola con la mano y decir “¡Bang!”. Si la persona nombrada no se agacha a tiempo, queda 'muerta' y debe acostarse en el suelo. Si se agacha a tiempo, los dos vecinos deben competir diciendo “Bang”, y quien lo haga primero 'mata' al otro. La persona que dispara primero sigue el juego diciendo un nuevo nombre. A medida que hay más personas en el suelo, aumenta la dificultad para identificar quién está al lado de quién.",
  objetivo:
    "Desarrollar rapidez de reacción, atención visual, coordinación social y toma de decisiones bajo presión.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "kim-jong-un",
  title: "Kim Jong Un",
  description:
    "Todos los participantes forman un círculo. Una persona inicia levantando los brazos con codos estirados y grita “Kim”. Quienes están a sus lados deben juntar las manos, apuntar hacia el centro y decir “Jong”. Luego, la persona del centro junta sus manos, apunta hacia alguien más y grita “Un”, pasando esa persona a ser la nueva que grita “Kim”. Los movimientos deben ser rápidos, rectos y tajantes. A medida que avanza el juego, la velocidad aumenta.",
  objetivo:
    "Trabajar la coordinación grupal, la rapidez de reacción, la atención visual y la precisión motriz a través de secuencias veloces.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "la-metralleta",
  title: "La metralleta",
  description:
    "Los participantes se organizan en círculo. Comienzan cantando “parapaparapapá”. Luego alguien dice: “la metralleta”. Todos cantan nuevamente “parapaparapapá”, y la persona a la derecha debe decir una palabra que rime con “metralleta” (como bicicleta, avioneta, marraqueta, etc.). El juego continúa avanzando por el círculo en ese orden, combinando la melodía con nuevas rimas en cada turno.",
  objetivo:
    "Fomentar la creatividad verbal, la agilidad mental y la participación lúdica mediante rimas rápidas intercaladas con melodía.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "vamos-a-plantar-maiz",
  title: "Vamos a plantar maíz a la moda de París",
  description:
    "Los participantes se colocan de pie en círculo y siguen una canción repetitiva con gestos acumulativos. El guía canta: “Vamos a plantar maíz a la moda de París. A la una…” y el grupo repite. Los gestos son: (1) cavar la tierra con ambas manos, (2) lanzar semillas al suelo con manos abiertas, (3) aplaudir y levantar brazos como si creciera la planta. En cada ronda se repite la secuencia con un gesto nuevo, acumulando todos los anteriores. La velocidad puede aumentar para mayor dificultad.",
  objetivo:
    "Trabajar ritmo, coordinación, memoria secuencial y participación grupal mediante gestos acumulativos acompañados de canto.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},
{
  id: "pelota-ping-pong",
  title: "Pelota de ping pong",
  description:
    "Los participantes se ubican en círculo y cantan una rima mientras coordinan saltos y turnos. La canción es: “Yo soy pelota de ping-pong”, “Y boto, boto, boto por todo el salón”, “Te tocó”, “Y boto, y boto, boto, boto…”. En “Yo soy pelota de ping-pong”, se preparan para rebotar; en “Y boto, boto, boto por todo el salón”, todos saltan tres veces simultáneamente; en “Te tocó”, la persona encargada señala a un compañero; y en “Y boto, y boto, boto, boto…”, quien fue señalado continúa la dinámica repitiendo desde el inicio. El turno cambia rápidamente y puede aumentarse la dificultad acelerando el ritmo.",
  objetivo:
    "Desarrollar la coordinación rítmica, la atención grupal y la rapidez de reacción mediante saltos y turnos sincronizados.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "en-la-china-me-encontre",
  title: "En la China me encontré",
  description:
    "Dinámica de coordinación motriz y memoria corporal siguiendo un formato acumulativo. Los participantes se organizan en círculo o semicírculo con el líder al centro, repitiendo la canción: “En la China me encontré, un animal particular. Que tenía el brazo así, el pie así, la espalda así, y hacía cui cui cui, y hacía cua cua cua.” En cada ronda se agrega una nueva parte del cuerpo que debe moverse, sin dejar de repetir los movimientos anteriores, acumulando cada gesto y manteniendo la secuencia completa.",
  objetivo:
    "Desarrollar coordinación motriz, memoria secuencial y expresión corporal bajo una estructura acumulativa.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "familia-sapo",
  title: "La Familia Sapo",
  description:
    "Dinámica grupal basada en una historia rítmica sobre una familia de sapos. La canción general es: “Estaba la familia sapo”, “Estaba [Miembro] sapo”, “Sucu tucu tucu tucu, sucu tucu tucu tucu sapo.” Los movimientos acompañan el ritmo: en “Estaba la familia sapo”, se realiza un aplauso rítmico o golpe de muslos; en “Estaba [Miembro] sapo”, se imita un gesto característico del miembro nombrado: Papá Sapo (brazos en jarra), Mamá Sapo (mano en el pecho o brazos abiertos), Abuelo Sapo (manos detrás de la espalda), Bebé Sapo (agacharse). En “sucu tucu tucu”, el grupo repite la mímica rítmica del personaje elegido.",
  objetivo:
    "Reforzar memoria secuencial, atención, ritmo y expresión corporal mediante gestos sincronizados con la canción.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "baile-ensalada",
  title: "Baile de la ensalada",
  description:
    "Actividad grupal rítmica y acumulativa donde se construye una 'ensalada' de gestos. La canción es: “Este es el baile de la ensalada que está de moda y a ti te gusta”, seguida de “Atención, atención” (manos en las orejas) y luego “Repetir, repetir” (manos en la cabeza). En la fase acumulativa, un participante nombra un ingrediente y realiza su gesto; el grupo repite. En cada ronda se repite la secuencia anterior y se añade un nuevo gesto. El ritmo base se mantiene con un patrón muslo-muslo-aplauso.",
  objetivo:
    "Desarrollar memoria secuencial, coordinación grupal, ritmo y creatividad al inventar gestos nuevos.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "piojo-juancho",
  title: "Piojo Juancho",
  description:
    "Los participantes se ubican en círculo y siguen la canción “El Piojo Juancho”, realizando mímicas coordinadas: en “¡Qué viene el piojo Juancho!”, se toman la cabeza con expresión de susto; en “¡Qué horror!, ¿qué hacemos?”, levantan los brazos moviéndolos rápidamente; en “Sacamos el matapiojos”, simulan sacar un frasco; en “Sacudimos el matapiojos”, lo agitan; en “Se lo echamos al compañero”, giran hacia la derecha y simulan aplicar el spray; luego “Le frotamos la cabeza”, masajean su cabeza. Al volver “¡Qué viene el piojo Juancho!”, todos saltan en su lugar. La secuencia puede acelerarse o invertirse.",
  objetivo:
    "Fomentar coordinación entre gesto y canción, expresión corporal, ritmo y participación activa.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "me-estafaron-huevo",
  title: "Me estafaron con un huevo",
  description:
    "Los participantes se colocan en semicírculo y cantan una secuencia repetitiva con gestos. La letra es: “Me estafaron con un huevo” (tocan la cabeza o frente), “Y no tenía pollo” (gesto de negación), “El huevo más fresco” (gesto de asombro o señalando algo importante), “Que no tenía pollo”, “Vamos a la huevería” (marchar o señalar), “A reclamar el huevo”, “¡Qué huevo más fresco!”, “Y no tenía pollo…”. Una persona líder dice cada frase primero y el grupo la repite con el gesto correspondiente.",
  objetivo:
    "Reforzar coordinación entre palabra y gesto, memoria inmediata y participación rítmica.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "el-ovillo",
  title: "El ovillo",
  description:
    "Los participantes forman un círculo. El profesor entrega el extremo del ovillo a la primera persona, quien lo sostiene y lanza el ovillo a otro compañero diciendo algo positivo sobre él. Cada persona sostiene su parte del hilo, dice algo positivo sobre el siguiente y le lanza el ovillo. Se forma una red visible que simboliza los vínculos del grupo. Al finalizar, el último participante devuelve el ovillo al inicial, completando la red.",
  objetivo:
    "Fomentar cohesión grupal, fortalecer vínculos afectivos, promover comunicación positiva y reforzar autoestima mediante retroalimentación positiva.",
  materiales: "Un ovillo de lana o hilo.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "un-elefante-se-balanceaba",
  title: "Un elefante se balanceaba",
  description:
    "Dinámica grupal basada en una canción acumulativa. La letra dice: “Un elefante se balanceaba sobre la tela de una araña. Como veía que resistía, fue a llamar a otro elefante.” Los participantes realizan un movimiento de balanceo hacia adelante y hacia los lados simulando el peso del elefante. Al final de cada ronda se suma un nuevo participante al balanceo, aumentando la coordinación requerida. La canción se repite agregando un elefante por ronda.",
  objetivo:
    "Desarrollar coordinación grupal, ritmo, memoria acumulativa y participación progresiva.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "juguemos-en-el-bosque",
  title: "Juguemos en el bosque",
  description:
    "Los participantes caminan y cantan: “Juguemos en el bosque mientras que el lobo no está”. Luego preguntan: “¿Lobo, estás?”. El lobo responde lo que está haciendo (“me estoy vistiendo”, “me pongo los zapatos”, etc.). El grupo avanza cantando y repite la pregunta en cada ronda. Cuando el lobo finalmente responde “¡Aquí estoy!”, intenta atrapar a alguien. Quien es atrapado pasa a ser el nuevo lobo.",
  objetivo:
    "Trabajar anticipación, atención, velocidad de reacción y coordinación grupal bajo un formato rítmico.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "pollito-pio",
  title: "El Pollito Pío",
  description:
    "Los participantes se ubican de pie y siguen la canción “El pollito pío”, imitando con gestos cada animal mencionado. Comienza con el pollito (piquitos con las manos o brazos recogidos como alas). A medida que avanza la canción, se agregan animales sucesivamente (gallina, gallo, pavo, paloma, gato, perro, cabra, vaca, toro, tractor, etc.), cada uno con su gesto o sonido. La secuencia es acumulativa: cada vez que aparece un animal, se repite la cadena completa desde el principio, aumentando la exigencia de memoria, ritmo y coordinación.",
  objetivo:
    "Fomentar memoria secuencial, coordinación corporal, expresión gestual y ritmo mediante acumulación progresiva.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},
{
  id: "canasta-frutas",
  title: "Canasta de frutas",
  description:
    "El grupo se posiciona sentado en un círculo, con una persona en el centro. Esta persona elige un tema y declara qué es lo que la canasta pide (por ejemplo, “la canasta pide a todas las personas de edad impar”). Todas las personas que cumplan la condición deben levantarse y cambiar rápidamente de asiento, mientras quien estaba en el centro intenta ocupar uno. El último en quedar de pie pasa al centro y elige la siguiente consigna.",
  objetivo:
    "Trabajar la reacción, la atención y el movimiento rápido en un ambiente lúdico de rompehielo.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "vamos-de-paseo",
  title: "Vamos de paseo",
  description:
    "Dinámica rítmica guiada por un integrante. La canción base dice: “Vamos de paseo, pip pip pip, en un auto feo, pip pip pip, pero no me importa, pip pip pip, porque como torta, pip pip pip, chu-chu gua”. El guía realiza gestos (mano al frente, dedo arriba, etc.) que el grupo debe imitar. Durante el 'chu-chu gua' los participantes se mueven hacia los lados manteniendo la posición. A lo largo del juego se añaden más gestos: lengua afuera, pata de pingüino, ‘poto de vieja’, entre otros, siguiendo siempre la estructura: Atención, Batallón, Mano al frente, Dedo arriba, Codos atrás, etc., terminando con el coro de 'chu-chu gua' repetido dos veces.",
  objetivo:
    "Desarrollar coordinación grupal, expresión corporal y seguimiento de instrucciones rítmicas de manera progresiva.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "veo-veo",
  title: "Veo veo, ¿qué ves?",
  description:
    "El líder piensa en un objeto visible y comienza el diálogo rítmico: Líder: 'Veo, veo'. Grupo: '¿Qué ves?'. Líder: 'Una cosa'. Grupo: '¿Qué cosa es?'. El líder entrega una pista y el grupo observa el entorno diciendo posibles respuestas. Quien adivina pasa a ser el nuevo líder.",
  objetivo:
    "Trabajar la observación atenta, la deducción y la concentración mediante un diálogo lúdico.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "robot-descompuesto",
  title: "El Robot Descompuesto",
  description:
    "Los participantes forman un círculo y el profesor anuncia que todos se convertirán en un robot descompuesto. El profesor menciona fallas que se van acumulando: 'Chispa en el hombro' (golpeteo rítmico en un hombro), 'Cable suelto en la cadera' (movimientos cortados de cadera), 'Antena temblorosa' (mano arriba vibrando), 'Pantalla parpadeando' (ojos abriéndose y cerrándose), 'Pierna trabada' (paso rígido). En cada ronda se acumulan todas las fallas anteriores, terminando con un robot completamente averiado.",
  objetivo:
    "Fomentar la expresión corporal, la coordinación, la atención auditiva y la participación activa mediante secuencias acumulativas.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "soy-una-serpiente",
  title: "Soy una serpiente",
  description:
    "Dos personas comienzan separadas, caminando y cantando: 'Soy una serpiente que anda por el bosque buscando una parte de su coooola, ¿quiere ser usted una parte de mi cola?'. Al terminar la canción, se acercan a alguien y lo invitan a unirse. El elegido pasa por debajo de las piernas del líder y se integra a la cola. El proceso continúa hasta que todos los participantes formen una serpiente completa.",
  objetivo:
    "Fomentar la coordinación grupal, el seguimiento, la organización espacial y la participación activa.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "soy-una-taza",
  title: "Soy una taza",
  description:
    "El grupo sigue una secuencia de gestos que representan objetos de cocina mientras cantan: 'Soy una taza' (mano derecha en la cintura), 'Una tetera' (mano izquierda levantada), 'Una cuchara' (manos arriba formando un círculo), 'Un cucharón' (bajan ambas por delante del cuerpo), 'Un plato plano' (brazos estirados al frente), 'Un plato hondo' (manos unidas simulando panza), 'Soy un cuchillo' (brazos juntos arriba), 'Y un tenedor' (manos separadas, codos flexionados), 'Soy un salero ch-ch-ch' (salto a la derecha moviendo caderas), 'Azucarero ts-ts-ts' (a la izquierda), 'La batidora – wuuu' (giro completo). Finaliza con 'Y se acabó'.",
  objetivo:
    "Trabajar memoria secuencial, coordinación corporal y expresión lúdica mediante una rutina acumulativa de gestos.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "oh-king-kong",
  title: "Oh King Kong",
  description:
    "Una persona se mueve como un gorila mientras el grupo canta: 'Oh King Kong, oh qué grande eres tú (x2). Yo soy grande, tú también, ven conmigo, yo te té, yo te té, yo te té'. Durante el verso 'ven conmigo', el King Kong se acerca a alguien e invita a esa persona a imitarlo. Ambos continúan caminando y expandiendo el grupo.",
  objetivo:
    "Promover la creatividad corporal, el juego expresivo y la interacción grupal mediante imitación y desplazamiento.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "chipi-chipi",
  title: "El chipi chipi",
  description:
    "Un integrante camina alrededor del grupo mientras se canta: 'Cuando fui a Nueva York a ver a la Mari, la Mari me enseñó a bailar el chipi chipi…'. Cuando llega la parte 'Baila el chipi chipi wuuu (x3) pero báilalo bien', el líder invita a alguien y ambos realizan el chipi chipi: puños en círculos y patita levantándose hacia los lados en cada 'wuu'. La dinámica continúa con nuevos participantes.",
  objetivo:
    "Fomentar coordinación rítmica, expresión corporal y participación mediante invitaciones individuales y baile guiado.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "baile-zuku-zuku",
  title: "El baile del zuku zuku",
  description:
    "Todos forman una ronda. Un integrante camina al ritmo de: 'Vamos todos, vamos a bailar, el baile más popular (x2). El baile del zuku zuku, zuku zuku te voy a dar (x2)'. La persona selecciona a otro para bailar el zuku zuku (darse vueltas mutuamente). El nuevo integrante sale a buscar a alguien más y la secuencia continúa.",
  objetivo:
    "Desarrollar ritmo, socialización, desplazamiento y disfrute grupal mediante invitaciones sucesivas al baile.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},

{
  id: "oh-king-kong",
  title: "Oh King Kong",
  description:
    "Una persona se mueve como un gorila mientras el grupo canta: 'Oh King Kong, oh qué grande eres tú (x2). Yo soy grande, tú también, ven conmigo, yo te té, yo te té, yo te té'. Durante el verso 'ven conmigo', el King Kong invita a un participante a unirse imitando al gorila.",
  objetivo:
    "Promover expresión corporal, creatividad y cohesión grupal mediante una dinámica de imitación progresiva.",
  materiales: "No requiere materiales.",
  variantes: "",
  tags: ["grupal"],
},
];

const JUEGOS_DATA = [
  {
  id: "juego-1",
  title: "Pinta",
  tags: ["grupal"],
  description: `El objetivo es elevar la energía del grupo, mejorar la velocidad de reacción y promover el compañerismo. Una, dos o tres personas previamente designadas persiguen al resto para “pintarlos”. Existen múltiples variantes que modifican la forma en que el jugador pintado queda inmovilizado o puede ser liberado.`,
  objetivo: `Aumentar la activación física, mejorar la velocidad de reacción, fomentar la cooperación y promover un ambiente dinámico.`,
  materiales: "No requiere materiales.",
  variantes: `• Pinta puente: quien es pintado debe formar un puente; para liberarlo, otro jugador debe pasar por debajo.\n• Pinta tortuga: el pintado queda boca arriba en el suelo “como tortuga” hasta que alguien lo dé vuelta.\n• Pinta caracol: el pintado adopta postura de caracol, con los “cachitos al sol”.\n• Pinta bosque: el jugador pintado se queda completamente quieto como un árbol (no hay liberación).\n• Pinta mixta: hombres vs. mujeres.`,
  imagenes: ["/juegos/Imagen1.png"]
},
{
  id: "juego-2",
  title: "Saludos",
  tags: ["grupal"],
  description: `Los participantes se desplazan dentro de un espacio limitado buscando interactuar con la mayor cantidad de compañeros posible durante un tiempo acotado. La dinámica incluye tres formas de interacción: intercambio de nombres, mención de la carrera que estudian y, finalmente, el intercambio de sonrisas.`,
  objetivo: `Fomentar la socialización, el reconocimiento entre compañeros, la desinhibición y un ambiente positivo.`,
  materiales: "No requiere materiales.",
  variantes: "",
  imagenes: ["/juegos/Imagen2.png"]
},
{
  id: "juego-3",
  title: "Cachipún",
  tags: ["parejas"],
  description: `Los participantes se forman en parejas y realizan duelos rápidos de cachipún. Dependiendo de la ronda, el perdedor debe realizar una penitencia específica mientras el ganador ejecuta un rol complementario.`,
  objetivo: `Promover la desinhibición, la confianza entre compañeros y aumentar la energía a través de interacciones lúdicas.`,
  materiales: "No requiere materiales.",
  variantes: `• Caballito: el perdedor carga al ganador y camina 5 pasos.\n• Guagua: el perdedor debe cargar al ganador en brazos.\n• Puente: el perdedor forma un puente y el ganador pasa gateando por debajo.`,
  imagenes: ["/juegos/Imagen3.png"]
},
{
  id: "juego-4",
  title: "Yo me llamo…",
  tags: ["grupal"],
  description: `Los participantes forman un círculo y cada uno debe decir el nombre de la persona a su derecha e izquierda, señalándolas con la mano correspondiente. Si alguien se equivoca, el grupo debe reordenarse y reiniciar la actividad. Puede usarse la variante en que se debe señalar al compañero opuesto usando la mano inversa.`,
  objetivo: `Fortalecer la memoria, el reconocimiento entre compañeros, las habilidades sociales y la coordinación motora.`,
  materiales: "No requiere materiales.",
  variantes: "",
  imagenes: ["/juegos/Imagen4.png"]
},
{
  id: "juego-5",
  title: "Pinta Pareja",
  tags: ["parejas"],
  description: `Versión cooperativa de la pinta. Los jugadores se desplazan en parejas tomadas de la mano. Si el número de participantes es impar, la persona sola comienza siendo quien la “lleva”, y si es par, dos personas la llevan juntas. Cuando una pareja pinta a otra, se forma una nueva pareja con el jugador recién pintado.`,
  objetivo: `Promover la coordinación, el trabajo en equipo y el movimiento continuo.`,
  materiales: "No requiere materiales.",
  variantes: `• En la variante de cuartetos, los jugadores se agrupan en grupos de cuatro tomados de las manos. Una pareja lleva la pinta y, al pintar a un cuarteto, este debe dividirse en dos parejas: una se une a los que pintan y la otra queda encargada de llevarla.`,
  imagenes: ["/juegos/Imagen5.png"]
},
{
  id: "juego-6",
  title: "Casa, inquilino, terremoto",
  tags: ["tríos", "grupal"],
  description: `Los participantes se organizan en tríos: dos personas forman una “casa” levantando los brazos tomados de las manos, y la tercera es el “inquilino” que se ubica bajo ese techo. El líder da órdenes en voz alta, y cada una requiere un cambio rápido de posición o de roles.`,
  objetivo: `Desarrollar la atención, la velocidad de reacción y la reorganización constante dentro del grupo.`,
  materiales: "No requiere materiales.",
  variantes: `Órdenes:\n• Casa: las casas deben moverse y cubrir a un nuevo inquilino.\n• Inquilino: los inquilinos buscan una nueva casa.\n• Terremoto: todas las formaciones se desarman y deben armarse nuevos tríos.`,
  imagenes: ["/juegos/Imagen6.png"]
},
{
  id: "juego-7",
  title: "Hermanos de…",
  tags: ["parejas"],
  description: `Cada persona tiene una pareja ubicada en el extremo opuesto del espacio. El líder grita “¡Hermanos de…!” seguido por una parte del cuerpo, y los participantes deben correr y juntarla con su pareja lo más rápido posible.`,
  objetivo: `Mejorar la velocidad de reacción, la movilidad y reforzar la interacción entre compañeros.`,
  materiales: "No requiere materiales.",
  variantes: "",
  imagenes: ["/juegos/Imagen7.png"]
},
{
  id: "juego-8",
  title: "Caballo/Camello",
  tags: ["grupal"],
  description: `El grupo se divide en dos equipos enfrentados: caballos y camellos. Al escuchar cuál equipo fue nombrado, ese grupo debe correr hacia su zona segura mientras el equipo contrario intenta atraparlos. Es fundamental mantener el enfrentamiento por duplas antes de la señal.`,
  objetivo: `Desarrollar agilidad, reacción inmediata, velocidad de desplazamiento y respeto por las reglas.`,
  materiales: "No requiere materiales.",
  variantes: `• Incorporar palabras que suenen parecidas.\n• Comenzar acostados en el suelo.\n• Partir de espaldas antes de correr.`,
  imagenes: ["/juegos/Imagen8.png"]
},
{
  id: "juego-9",
  title: "Tomada de bomberos",
  tags: ["grupal"],
  description: `Los jugadores se organizan en equipos en fila. Dos integrantes cumplen el rol de “bomberos”: con la mano izquierda toman su muñeca derecha y con la derecha toman la muñeca izquierda del compañero, formando un asiento firme. Sobre esa “camilla” trasladan a un compañero hasta el otro extremo de la cancha y regresan a buscar al siguiente.`,
  objetivo: `Fomentar la coordinación, fuerza física, trabajo en equipo y confianza entre los jugadores.`,
  materiales: "No requiere materiales.",
  variantes: `Los roles de bomberos pueden ir rotando para que todos participen tanto cargando como siendo trasladados.`,
  imagenes: ["/juegos/Imagen9.png"]
},
{
  id: "juego-10",
  title: "Cadena humana", 
  tags: ["grupal"],
  description: `Los participantes forman una hilera. El primero corre a máxima velocidad hasta la línea media y vuelve a buscar al segundo. Tomados de la mano, repiten el recorrido y buscan al siguiente, acumulando compañeros hasta que la cadena completa llegue a la línea y regrese al punto inicial sin soltarse.`,
  objetivo: `Mejorar la resistencia, la velocidad y la coordinación grupal.`,
  materiales: "No requiere materiales.",
  variantes: "",
  imagenes: ["/juegos/Imagen10.png"]
},
{
  id: "juego-11",
  title: "Carrera",
  tags: ["grupal"],
  description: `Juego de relevo competitivo centrado en esfuerzos explosivos de corta duración, trabajando la potencia aeróbica aláctica. Los jugadores se organizan en equipos del mismo tamaño sentados en hileras. El primer integrante corre hasta un punto objetivo, se sienta allí y, solo entonces, el siguiente puede salir. El proceso continúa hasta que todo el equipo haya llegado al punto final.`,
  objetivo: `Potenciar la máxima velocidad en trayectos cortos, fomentar la motivación grupal, el espíritu competitivo sano y la coordinación por relevos.`,
  materiales: "No requiere materiales.",
  variantes: `• Carrera zigzag: se agregan conos y los corredores deben rodearlos.\n• Carrera retro: los participantes deben correr de espaldas.\n• Carrera con giro: al llegar al punto objetivo deben dar una vuelta completa antes de sentarse.`,
  imagenes: ["/juegos/Imagen11.png"]
},
{
  id: "juego-12",
  title: "Relevo de Elefante",
  tags: ["grupal"],
  description: `Se divide al grupo en equipos que se forman en hilera. El primer jugador corre hasta un punto y regresa. Al volver, debe tomar la mano del siguiente compañero pasando el brazo entre sus piernas, de modo que ambos queden unidos agachados y deban desplazarse juntos. Cada vez se suma un integrante hasta que todo el equipo avanza unido en forma de “elefante”. Gana el equipo que complete el recorrido de manera más rápida y coordinada.`,
  objetivo: `Desarrollar la resistencia física, fuerza de piernas, coordinación grupal, sincronización y cooperación estratégica.`,
  materiales: "No requiere materiales.",
  variantes: `• Elefante ciego: el primero cierra los ojos y el segundo guía.\n• Elefante inverso: la cadena avanza caminando hacia atrás.\n• Elefante zigzag: deben esquivar obstáculos sin romper la cadena.`,
  imagenes: ["/juegos/Imagen12.png"]
},
{
  id: "juego-13",
  title: "Cuncuna de agua",
  tags: ["grupal"],
  description: `Dos equipos de 10 jugadores se sientan en hilera. Cada grupo cuenta con un bidón de 5 litros y un bidón de 3 litros cortado y perforado. El primero llena su recipiente desde un tarro común, vuelve a su lugar y lo pasa por encima de su cabeza al siguiente compañero. El último del equipo lo vierte en el bidón grande y corre al inicio para repetir el ciclo. Se juega por 5 minutos. Gana el equipo con más agua acumulada.`,
  objetivo: `Fomentar la coordinación motriz, el trabajo en equipo, la perseverancia y la gestión del tiempo bajo presión.`,
  materiales: "Bidón grande, bidón pequeño perforado, tarro con agua.",
  variantes: `• Cuncuna sin derramar: si se cae agua en el trayecto, deben repetir la pasada.\n• Cuncuna de velocidad: se reduce el tiempo a 2 minutos.\n• Cuncuna nocturna: con los ojos vendados para aumentar el desafío.`,
  imagenes: ["/juegos/Imagen13.png"]
},
{
  id: "juego-14",
  title: "Cuerpo a tierra",
  tags: ["grupal"],
  description: `Los participantes forman una hilera acostados con espacios entre sí. Todos parten de pie. El jugador ubicado al final grita “¡cuerpo a tierra!” y todos deben acostarse instantáneamente para permitirle avanzar saltando sobre cada compañero. Al llegar al inicio, se acuesta, y ahora el nuevo último jugador repite la instrucción. La dinámica continúa hasta recorrer el espacio designado.`,
  objetivo: `Mejorar la agilidad, la coordinación, la comunicación y la reacción grupal.`,
  materiales: "No requiere materiales.",
  variantes: `• Cuerpo a tierra sorpresa: el comando lo da el profesor en momentos inesperados.\n• Cuerpo a tierra reptado: en vez de saltar, deben reptar por encima.\n• Cuerpo a tierra doble: avanzan dos jugadores por turno.`,
  imagenes: ["/juegos/Imagen14.png"]
},
{
  id: "juego-15",
  title: "Pasada del elefante",
  tags: ["grupal"],
  description: `Los participantes forman equipos en hileras. Cada hilera debe transportar un objeto (pelota, cono o colchoneta pequeña) pasando este elemento por debajo de las piernas del primero al último, sin dejarlo caer. Al recibirlo, el último jugador corre al frente de la hilera y repite el proceso. Gana el equipo que complete un número determinado de ciclos antes que los demás.`,
  objetivo: `Estimular la coordinación, precisión y trabajo en cadena bajo presión.`,
  materiales: "Pelota u objeto equivalente.",
  variantes: `• Pasada aérea: el objeto se pasa por encima de la cabeza.\n• Pasada combinada: alternan entre arriba y abajo.\n• Pasada rápida: límite de tiempo de 1 minuto.`,
  imagenes: ["/juegos/Imagen15.png"]
},
{
  id: "juego-16",
  title: "Llevar el diario",
  tags: ["individual", "grupal"],
  description: `Consiste en trasladar una hoja de diario desde un punto a otro sin que caiga, obedeciendo distintas restricciones según la variante. El participante debe controlar su velocidad y la dirección del viento. Si el diario cae, debe volver al inicio. También existe una versión grupal donde todos deben sostener la hoja uniendo sus palmas.`,
  objetivo: `Mejorar la coordinación, equilibrio, control corporal y cooperación en la versión de equipo.`,
  materiales: "Hojas de diario.",
  variantes: `• Mano derecha.\n• Mano izquierda.\n• Ambas manos.\n• Diario en la cara (a ciegas).\n• Variante grupal: todos sostienen el mismo diario formando una gran hilera.\n• Variante inventada: carrera en zigzag esquivando conos sin perder el diario.`,
  imagenes: ["/juegos/Imagen16.png"]
},
{
  id: "juego-17",
  title: "Juego de Pepito",
  tags: ["individual", "grupal"],
  description: `Pepito es una figura hecha con papel de diario doblado, con ojos y boca dibujados. No tiene extremidades, pero su cuerpo puede doblarse en cuello, cintura y rodillas. El docente manipula a Pepito realizando acciones (inclinarse, sentarse, doblarse, torcerse), y todos deben imitarlo de inmediato.`,
  objetivo: `Fomentar la atención selectiva, la concentración, la coordinación motriz fina y la imitación precisa.`,
  materiales: "Tira de diario doblada (Pepito).",
  variantes: `• Pepito rápido: los movimientos se ejecutan con velocidad creciente.\n• Pepito engañoso: se agregan movimientos falsos que NO deben imitarse.\n• Pepito líder: un estudiante toma el rol del profesor por turnos.`,
  imagenes: ["/juegos/Imagen17.png"]
},
{
  id: "juego-18",
  title: "Juego de la momia",
  tags: ["grupal"],
  description: `Un jugador actúa como líder, de espaldas al resto. Cuando está girado, los demás avanzan intentando alcanzarlo. Cuando se voltea repentinamente, todos deben quedar inmóviles y cubrirse con una hoja de diario simulando ser “momias”. Si alguien se mueve o no está cubierto, vuelve al inicio.`,
  objetivo: `Desarrollar rapidez de reacción, autocontrol, estrategia y anticipación sin ser detectado.`,
  materiales: "Hojas de diario.",
  variantes: `• Momia doble: deben cubrirse con dos hojas.\n• Momia congelada: si alguien se mueve, todo el grupo retrocede.\n• Momia sigilosa: deben avanzar sin hacer ruido.`,
  imagenes: ["/juegos/Imagen18.png"]
},
{
  id: "juego-19",
  title: "Juego del globo",
  tags: ["individual"],
  description: `Todos los jugadores parten desde la línea inicial y deben desplazarse hacia la mitad del espacio imitando diferentes situaciones ficticias relacionadas a un globo. Cada variante modifica por completo la forma de moverse.`,
  objetivo: `Estimular la creatividad, expresión corporal, coordinación motriz y uso del cuerpo en dinámicas imaginarias.`,
  materiales: "No requiere materiales.",
  variantes: `• El globo te lleva libre.\n• El globo te lleva con resistencia.\n• El globo pesa “1000 kg”.\n• Globo bajo el brazo estirado.\n• Globo entre los brazos estirados.\n• Globo entre las rodillas.\n• Variante inventada: globo invisible (deben actuar sin globo físico).`,
  imagenes: ["/juegos/Imagen19.png"]
},
{
  id: "juego-20",
  title: "Pasarse el globo",
  tags: ["grupal"],
  description: `Los equipos se forman en hilera. La persona delantera sostiene un globo y debe pasarlo hacia atrás por encima de la cabeza, hasta llegar al último jugador. Este corre al frente con el globo y repite el proceso hasta llegar a la meta. Existen variantes donde el globo se pasa por debajo de las piernas, hacia un costado o combinando todas las técnicas.`,
  objetivo: `Promover la coordinación en cadena, el trabajo en equipo, la rapidez de reacción y la adaptación a diferentes formas de pasar el globo.`,
  materiales: "Un globo inflado por equipo.",
  variantes: `• Pasarlo por debajo de las piernas.\n• Izquierda/derecha.\n• Combinado arriba-abajo-lados.\n• Variante inventada: globo con obstáculos (deben esquivar conos).`,
  imagenes: ["/juegos/Imagen20.png"]
},
{
  id: "juego-21",
  title: "Pegarse con el globo",
  tags: ["grupal"],
  description: `Cada participante sostiene un globo propio y debe usarlo para golpear amistosamente a otros jugadores, mientras evita ser golpeado. Se genera una “guerra de globos” dinámica, rápida y caótica.`,
  objetivo: `Trabajar la agilidad, velocidad de reacción, desplazamientos rápidos y toma de decisiones bajo presión.`,
  materiales: "Un globo por participante.",
  variantes: `• Globo congelado: si el globo toca el piso, el jugador queda congelado y solo revive si alguien le pega con su globo.\n• Globo color objetivo: solo puedes golpear a personas cuyo globo sea del color indicado por el profesor.\n• Globo zona segura: se marcan áreas donde está prohibido golpear; obliga a pensar estratégicamente.`,
  imagenes: ["/juegos/Imagen21.png"]
},
{
  id: "juego-22",
  title: "Barco",
  tags: ["grupal"],
  description: `La cancha se divide en cuatro zonas: proa (adelante), popa (atrás), estribor (derecha) y babor (izquierda). Todos parten al centro. El profesor grita una dirección y los estudiantes corren al sector correspondiente para luego volver al centro. Además, si se anuncia “bote de a… (número)”, los jugadores deben sentarse formando hileras del tamaño solicitado.`,
  objetivo: `Estimular la reacción rápida, orientación espacial, escucha activa y atención sostenida.`,
  materiales: "No requiere materiales.",
  variantes: `• Barco tormentoso: se agregan direcciones falsas que no deben obedecer.\n• Barco silencioso: deben moverse sin hacer ruido.\n• Barco invertido: derecha e izquierda se intercambian a propósito.`,
  imagenes: ["/juegos/Imagen22.png"]
},
{
  id: "juego-23",
  title: "Escribirse animales en la espalda",
  tags: ["grupal"],
  description: `A cada participante se le adhiere en la espalda una hoja con un animal o profesión, sin que este la vea. Deben caminar por el espacio haciendo solo preguntas de “sí” o “no” a otros compañeros hasta deducir qué palabra tienen en su espalda.`,
  objetivo: `Fomentar la comunicación efectiva, pensamiento lógico, razonamiento deductivo y la interacción social.`,
  materiales: "Hojas con nombres pegadas en la espalda.",
  variantes: `• Temática: todos los personajes pertenecen a una misma categoría (animales del mar, profesiones, películas, etc.).\n• Pregunta limitada: máximo 10 preguntas por persona.\n• Silencioso: solo se puede responder con gestos de pulgar arriba/abajo.`,
  imagenes: ["/juegos/Imagen23.png"]
},
{
  id: "juego-24",
  title: "Pase handball",
  tags: ["parejas", "grupal"],
  description: `En parejas separadas por aproximadamente 2 metros, los estudiantes se desplazan lateralmente mientras se pasan una pelota sin dejarla caer, avanzando ida y vuelta hasta mitad de cancha. Luego se suma una tercera persona para formar la “trenza de pases”, donde el jugador central pasa la pelota, se cambia de posición y la secuencia continúa alternando ambos lados.`,
  objetivo: `Trabajar agilidad, coordinación óculo-manual, desplazamiento lateral y comunicación efectiva.`,
  materiales: "Una pelota por pareja/trío.",
  variantes: `• Pases altos desde la cabeza.\n• Pases desde el pecho.\n• Trenza rápida: el cambio de puesto debe hacerse con máxima velocidad.\n• Trenza diagonal: avanzan en zigzag.`,
  imagenes: ["/juegos/Imagen24.png"]
},
{
  id: "juego-25",
  title: "Nudo Humano",
  tags: ["grupal", "equipo"],
  description: `Los participantes se ubican formando un círculo y se toman de las manos con dos personas distintas que no estén inmediatamente a su lado, generando un gran nudo humano de brazos. 
                Una vez que todos estén sujetos por ambas manos, el grupo debe coordinarse para desenredarse sin soltarse, moviéndose hacia adelante, atrás o girando según sea necesario, hasta volver a una figura ordenada. 
                El juego también puede hacerse como competencia entre varios equipos, donde gana el que logre desenredar su nudo primero.`,
  objetivo: `Fomentar la comunicación efectiva, el trabajo colaborativo, la estrategia grupal y la coordinación motriz. 
El desafío consiste en desenredar el nudo humano en el menor tiempo posible sin soltarse de las manos.`,
  materiales: "No requiere materiales.",
  variantes: `• Competencia por tiempo: varios equipos hacen su propio nudo humano y gana el que se desenreda más rápido.
              • Nudo silencioso: los participantes deben desenredarse sin hablar, aumentando la dificultad y fomentando la comunicación no verbal.
              • Nudo con ojos cerrados: solo una persona del equipo puede ver; el resto sigue sus instrucciones.
              • Mega-nudo: dos círculos se entremezclan para formar un nudo más grande y complejo.`,
  imagenes: ["/juegos/Imagen25.png"]
},
{
  id: "juego-26",
  title: "Países",
  tags: ["grupal"],
  description: `Cada jugador escoge el nombre de un país. Un participante al centro lanza la pelota hacia arriba y grita “¡(nombre del país)!”. El jugador llamado corre a atraparla mientras el resto huye. Cuando atrapa la pelota, grita “¡alto!” y todos se detienen. Puede dar tres pasos para intentar golpear a alguien con la pelota. Si acierta, ese jugador inicia la siguiente ronda; si falla, inicia él mismo.`,
  objetivo: `Desarrollar velocidad de reacción, puntería, atención auditiva y agilidad.`,
  materiales: "Pelota.",
  variantes: `• Países silenciosos: el lanzador solo hace mímica del país.\n• Pasos pequeños: máximo 2 pasos antes de lanzar.\n• País ninja: no se puede mirar hacia atrás mientras se huye.`,
  imagenes: ["/juegos/Imagen26.png"]
},
{
  id: "juego-27",
  title: "Pasar la pelota acostados con los pies",
  tags: ["grupal"],
  description: `Los jugadores se ubican acostados en una hilera. El primero sostiene la pelota con los pies, la eleva y el siguiente debe atraparla con los suyos. Ese jugador repite el procedimiento hacia atrás mientras el primero corre a acostarse al final de la hilera. Continúa hasta llegar al otro extremo del espacio.`,
  objetivo: `Mejorar coordinación de piernas, fuerza de core, sincronización y trabajo cooperativo.`,
  materiales: "Pelota.",
  variantes: `• Pelota gigante: usar balón más grande para aumentar dificultad.\n• Pasada turbo: deben completar el circuito contra reloj.\n• Dos hileras compitiendo para ver quién llega primero.`,
  imagenes: ["/juegos/Imagen27.png"]
},
{
  id: "juego-28",
  title: "Trenza con pelota",
  tags: ["grupal"],
  description: `Tres jugadores avanzan hacia adelante formando una línea. El jugador del centro inicia con la pelota y la pasa a un costado; inmediatamente ambos intercambian posición, quedando ahora ese jugador al centro. Luego pasa la pelota al lado opuesto y nuevamente se intercambia el centro, generando una “trenza” continua.`,
  objetivo: `Desarrollar coordinación, sincronización en movimiento, pases precisos y trabajo colectivo.`,
  materiales: "Pelota.",
  variantes: `• Trenza rápida: la pelota debe mantenerse en constante movimiento.\n• Trenza en zigzag.\n• Trenza silenciosa: sin hablar entre ellos.`,
  imagenes: ["/juegos/Imagen28.png"]
},
{
  id: "juego-29",
  title: "Juegos chilenos",
  tags: ["grupal", "individual"],
  description: `Incluye dos juegos tradicionales:\n\n• **Carrera de sacos**: cada integrante del equipo se mete en un saco y avanza saltando ida y vuelta, pasando el saco al siguiente participante.\n• **Emboque**: juego individual donde debe encajarse el palito dentro del orificio del maso.\nAmbos fomentan la cultura lúdica chilena y la coordinación.`,
  objetivo: `Carrera de sacos: trabajar velocidad de reacción, resistencia física y rapidez.\nEmboque: desarrollar motricidad manual y precisión.`,
  materiales: "Sacos y emboques.",
  variantes: `• Carrera zigzag.\n• Competencia de emboque por tiempo.\n• Emboque con mano no dominante.`,
  imagenes: ["/juegos/Imagen29_1.png", "/juegos/Imagen29_2.png"]
},
{
  id: "juego-30",
  title: "Relevos con salto de cuerda",
  tags: ["grupal"],
  description: `Los equipos se ubican en hilera. El primer participante corre hasta la cuerda, realiza 10 saltos y vuelve a chocar la mano del siguiente para repetir el proceso. Se pueden incluir variantes como saltos hacia atrás, saltos cruzados, galopa, etc.`,
  objetivo: `Desarrollar resistencia física, coordinación, precisión en el salto, agilidad y trabajo en equipo.`,
  materiales: "Una cuerda de saltar por equipo.",
  variantes: `• Saltos hacia atrás.\n• Saltos cruzados.\n• Salto galopa.\n• Salto lateral.\n• “Cuerda fantasma”: deben hacer los saltos sin cuerda como desafío técnico.`,
  imagenes: ["/juegos/Imagen30.png"]
},
{
  id: "juego-31",
  title: "Pinta con cuerda",
  tags: ["grupal"],
  description: `Variante del clásico juego de pinta. Se designa a 1 o más participantes como los que pillan, entregándoles una cuerda para saltar. Ellos deben perseguir a los demás saltando a pies juntos y, para atraparlos, deben envolverlos con la cuerda. Los demás solo pueden escapar saltando.`,
  objetivo: `Fomentar la coordinación, el trabajo aeróbico y la resistencia física bajo movimiento continuo.`,
  materiales: "Una cuerda de saltar por cada jugador encargado de pillar.",
  variantes: `• Pinta doble cuerda: deben atrapar envolviendo con la cuerda por delante y por detrás.\n• Pinta zigzag: quienes escapan deben moverse solo en zigzag.\n• Pinta lenta: los atrapadores deben saltar en cámara lenta, obligando a estrategias distintas.`,
  imagenes: ["/juegos/Imagen31.png"]
},
{
  id: "juego-32",
  title: "Saltar la cuerda en pareja",
  tags: ["parejas"],
  description: `Dos participantes trabajan con una cuerda. Uno sostiene ambos extremos con las manos, y ambos deben saltar sincronizadamente: quien sujeta la cuerda salta de frente, mientras que el otro salta de espaldas a ella. Exige ritmo, concentración y trabajo conjunto.`,
  objetivo: `Desarrollar coordinación motriz fina y gruesa, ritmo conjunto y comunicación entre compañeros.`,
  materiales: "Una cuerda por pareja.",
  variantes: `• Salto cruzado: cada cierto tiempo deben cruzar manos al saltar.\n• Cambio de roles cada 10 saltos.\n• Salto silencioso: prohibido hablar mientras coordinan.`,
  imagenes: ["/juegos/Imagen32.png"]
},
{
  id: "juego-33",
  title: "Saltar la cuerda todos juntos",
  tags: ["grupal"],
  description: `Dos personas sostienen una cuerda larga que gira de forma constante mientras 1 o más jugadores entran al centro para saltar. La actividad requiere sincronización rítmica para entrar, saltar y salir sin que la cuerda toque sus pies. Se pueden aumentar dificultades variando pasos, velocidades y entradas en movimiento.`,
  objetivo: `Desarrollar coordinación rítmica, agilidad, trabajo en equipo y control corporal en dinámicas grupales.`,
  materiales: "Cuerda larga.",
  variantes: `• Entradas múltiples sin detener la cuerda.\n• Salto con pasos laterales.\n• Velocidad progresiva.\n• “Entrar desde atrás”: deben ingresar por la zona ciega del giro.`,
  imagenes: ["/juegos/Imagen33.png"]
},
{
  id: "juego-34",
  title: "Transporte en colchoneta",
  tags: ["grupal"],
  description: `Un jugador se acuesta sobre una colchoneta con los brazos estirados hacia adelante. El resto del equipo debe transportarlo desde un extremo de la cancha al otro, coordinando fuerza y agarres seguros. Al llegar, cambian al participante transportado y repiten hasta que todos hayan participado. Gana el equipo que complete el circuito primero.`,
  objetivo: `Trabajar fuerza, coordinación grupal, responsabilidad corporal y confianza entre pares.`,
  materiales: "Una colchoneta.",
  variantes: `• Versión Aladdin: el transportado va sentado como en una “alfombra voladora”.\n• Transporte zigzag.\n• Transportar cambiando el agarre mid-recorrido.`,
  imagenes: ["/juegos/Imagen34.png"]
},
{
  id: "juego-35",
  title: "Fórmalo y no pagarás",
  tags: ["grupal"],
  description: `Cada equipo se coloca sobre una lenteja inicial y otra final. El moderador indica una figura que deben formar entre todos utilizando su cuerpo (puede ser de pie o en el suelo). Cada grupo corre a su lenteja final y debe formar la figura lo más rápido posible. Se repite varias veces cambiando la figura geométrica, forma humana, letra o número.`,
  objetivo: `Fomentar creatividad corporal, trabajo en equipo, pensamiento rápido y coordinación grupal.`,
  materiales: "Dos lentejas o conos por equipo.",
  variantes: `• Figuras en movimiento (dinámicas).\n• Figuras temáticas: animales, letras, objetos.\n• Figuras sin hablar: comunicación solo gestual.`,
  imagenes: ["/juegos/Imagen35.png"]
},
{
  id: "juego-36",
  title: "Transporte en colchoneta 2",
  tags: ["grupal"],
  description: `Todos los participantes menos uno se acuestan en el pasto formando una superficie móvil. Sobre ellos, sobre una colchoneta, se coloca un compañero que debe ser transportado girando todos simultáneamente sobre su propio cuerpo, avanzando como una “cinta humana” hasta llegar a la meta.`,
  objetivo: `Fomentar trabajo en equipo, comunicación, coordinación colectiva y responsabilidad física.`,
  materiales: "Una colchoneta.",
  variantes: `• Transporte inverso: deben avanzar hacia atrás.\n• Transporte con obstáculos a sortear.\n• Cambio de ritmo: más rápido o más lento según orden.`,
  imagenes: ["/juegos/Imagen36.png"]
},
{
  id: "juego-37",
  title: "Juegos con bastón",
  tags: ["parejas", "grupal"],
  description: `Se utilizan bastones o tubos de PVC para ejecutar distintas dinámicas orientadas al equilibrio, coordinación y trabajo conjunto. En parejas, cada jugador sostiene un extremo del bastón y otras parejas deben pasar por arriba o por debajo. En grupos de cuatro, se forman cuadrados lanzando bastones hacia compañeros opuestos o en diagonal. Además, individualmente se pueden practicar equilibrios como sostener el bastón sobre la palma de la mano o el pie mientras se avanza.`,
  objetivo: `Favorecer coordinación motriz, equilibrio, control corporal y colaboración entre participantes.`,
  materiales: "Bastones o tubos de PVC.",
  variantes: `• Carrera equilibrando bastones.\n• Pases de bastón con saltos.\n• Cuadrado rotante: los cuatro rotan mientras siguen lanzando.`,
  imagenes: ["/juegos/Imagen37.png"]
},
{
  id: "juego-38",
  title: "10 pases sin ser interceptado",
  tags: ["equipos"],
  description: `Dos equipos compiten en un espacio delimitado. El objetivo es lograr 10 pases consecutivos sin que el balón toque el suelo y sin que el equipo rival lo intercepte. Cada vez que se pierde la posesión, el conteo vuelve a cero y la pelota cambia de equipo.`,
  objetivo: `Fomentar trabajo en equipo, visión periférica, defensa activa, movilidad constante y toma de decisiones.`,
  materiales: "Un balón y petos de colores.",
  variantes: `• 5 pases en velocidad.\n• Solo pases altos.\n• Sin desplazarse con balón: deben pasar inmediatamente.\n• Defensa congelada por 2 segundos cada vez que intercepta.`,
  imagenes: ["/juegos/Imagen38.png"]
},
{
  id: "juego-39",
  title: "Tombo",
  tags: ["equipos"],
  description: `Juego grupal en donde un equipo batea y corre mientras el otro lanza y defiende. El defensor lanza la pelota hacia el bateador, quien debe golpearla con la mano abierta e iniciar la carrera hacia las bases. El equipo defensor debe recuperar la pelota lo más rápido posible para “quemar” al corredor antes de que llegue a una base segura. Si completa la vuelta suma 1 punto; si es quemado, queda eliminado o pasa a la zona designada. Tras un número acordado de eliminaciones, los equipos cambian de rol.`,
  objetivo: `Desarrollar agilidad, coordinación, estrategia, comunicación y toma de decisiones bajo presión.`,
  materiales: "Pelota y bases.",
  variantes: `• Lanzamientos dobles: dos pelotas en juego.\n• Bases móviles.\n• Tombo silencioso: no se puede hablar al defender.`,
  imagenes: ["/juegos/Imagen39.png"]
},
{
  id: "juego-40",
  title: "Carrera de cuncunas",
  tags: ["equipos"],
  description: `Equipos formados en hilera. El primero corre a buscar un globo, vuelve y lo coloca entre su torso y el del siguiente formando la “cuncuna”. Luego ambos van por un segundo globo, vuelven, y se unen al tercer participante. Esto continúa hasta unir a todo el equipo sin que los globos caigan ni se separen.`,
  objetivo: `Fomentar coordinación, trabajo en equipo, equilibrio y rapidez bajo presión.`,
  materiales: "Globos.",
  variantes: `• Cuncuna doble: se forman dos columnas paralelas.\n• Cuncuna con obstáculos.\n• Cuncuna muda: prohibido hablar mientras coordinan.`,
  imagenes: ["/juegos/Imagen40.png"]
},
{
  id: "juego-41",
  title: "Pases mano-pie",
  tags: ["equipos"],
  description: `Dos equipos se enfrentan en una cancha con arcos. La pelota solo puede ser agarrada con las manos, pero debe pasarse al resto del equipo usando los pies; el receptor vuelve a tomarla con las manos. No se puede avanzar con la pelota en la mano ni entrar al área rival (solo el arquero puede hacerlo). El objetivo es progresar colectivamente hacia el arco rival y anotar pateando.`,
  objetivo: `Desarrollar coordinación mano–pie, toma de decisiones rápidas, respeto por reglas y estrategias colectivas.`,
  materiales: "Pelota y arcos.",
  variantes: `• Pase obligatorio a todos antes de patear.\n• Campo reducido.\n• Solo se puede dar 3 pasos antes de soltar la pelota.`,
  imagenes: ["/juegos/Imagen41.png"]
},
{
  id: "juego-42",
  title: "Juegos de confianza",
  tags: ["parejas", "grupal"],
  description: `Ejercicios destinados a trabajar la confianza entre compañeros. Primero, en parejas similares en estatura, un participante se coloca rígido y de espaldas, dejándose caer para que el compañero lo sostenga. Luego se intercambian roles. Después, las parejas se unen para formar grupos de 3 o 4, dejando a una persona al centro. Esta se deja caer en cualquier dirección mientras el grupo la detiene suavemente y la impulsa hacia otro lado, generando un balanceo continuo sin que caiga.`,
  objetivo: `Fomentar la confianza mutua, responsabilidad, comunicación no verbal y seguridad corporal.`,
  materiales: "No requiere.",
  variantes: `• Caídas desde mayor distancia (controlada).\n• Círculo dinámico que rota lentamente.\n• Versión con ojos vendados para el participante del centro.`,
  imagenes: ["/juegos/Imagen42.png"]
},
{
  id: "juego-43",
  title: "El telégrafo",
  tags: ["equipos"],
  description: `Se forman equipos de 4 a 7 personas en hilera. El líder (último de la fila) observa un dibujo que muestra el profesor y luego lo “transmite” trazándolo con su dedo en la espalda del compañero de adelante. Cada jugador repite lo que sintió en la espalda de la persona siguiente. El primero de la fila debe dibujar en papel lo que recibió. Gana el equipo cuyo dibujo final se asemeje más al original. Se realizan varias rondas cambiando líder y dibujante.`,
  objetivo: `Fomentar comunicación efectiva, precisión, atención y trabajo en equipo.`,
  materiales: "Papel y lápices.",
  variantes: `• Dibujos más complejos.\n• Transmisión sin usar el dedo (solo nudillos).\n• Rondas de velocidad: tiempo limitado para transmitir.`,
  imagenes: ["/juegos/Imagen43.png"]
},
{
  id: "juego-44",
  title: "Trampolín, Canasto y Pelotas de Tenis",
  tags: ["equipos"],
  description: `Equipos compiten lanzando pelotas de tenis hacia un trampolín para que reboten y caigan dentro de un canasto ubicado más adelante. Solo cuentan las pelotas que entren en el canasto tras el rebote. Se avanza por fases y se realiza una ronda final para definir al ganador.`,
  objetivo: `Trabajar la coordinación óculo-manual, precisión en el lanzamiento, control de fuerza, planificación estratégica y motivación grupal.`,
  materiales: "Trampolín, pelotas de tenis y canasto.",
  variantes: `• Distancias progresivas.\n• Rebote obligatorio con distintos ángulos.\n• Lanzamientos desde posiciones específicas (sentado, de rodillas, lateral).`,
  imagenes: ["/juegos/Imagen44.png"]
},
{
  id: "juego-45",
  title: "Las colitas",
  tags: ["equipos"],
  description: `Dos equipos compiten usando petos como “colitas”. Cada jugador debe intentar robar las colitas del equipo rival y guardarlas en una zona propia. Si un jugador pierde su colita queda eliminado, pero puede ser revivido si un compañero recupera una colita del sector rival y se la devuelve. Se puede limitar el espacio o eliminar la resurrección según la variante.`,
  objetivo: `Trabajar velocidad de reacción, estrategia grupal, coordinación y entretenimiento competitivo.`,
  materiales: "Petos (uno por participante).",
  variantes: `• Campo reducido.\n• Sin revivir.\n• Tiempo limitado con conteo final de colitas.`,
  imagenes: ["/juegos/Imagen45.png"]
},
{
  id: "juego-46",
  title: "Jesús lleva agua",
  tags: ["equipos"],
  description: `Equipos compiten transportando agua mediante un tubo de PVC colocado sobre los hombros, con dos vasos llenos amarrados a cada extremo. El jugador debe recorrer un circuito sin derramar agua, volver y entregar el tubo al siguiente compañero. Gana el equipo que termina con más agua en los vasos.`,
  objetivo: `Desarrollar equilibrio, coordinación, concentración y cuidado en el transporte.`,
  materiales: "Tubo de PVC y vasos con agua.",
  variantes: `• Circuitos con giros más exigentes.\n• Carrera en parejas uniendo dos tubos.\n• Agua teñida para medir pérdidas con mayor claridad.`,
  imagenes: ["/juegos/Imagen46.png"]
},
{
  id: "juego-47",
  title: "Cachipún Alemán",
  tags: ["equipos"],
  description: `Dos equipos se enfrentan realizando un circuito en zigzag entre conos. Al llegar a la esquina designada, el participante debe avanzar saltando en un pie hasta encontrarse con el contrincante del otro equipo. Allí juegan una ronda rápida de cachipún. Quien gana continúa hacia la meta para sumar puntos; quien pierde vuelve al inicio. El juego se mantiene por tiempo y gana el equipo que suma más puntos.`,
  objetivo: `Desarrollar agilidad, toma rápida de decisiones, anticipación, coordinación motriz y trabajo en equipo.`,
  materiales: "Conos y espacio delimitado.",
  variantes: `• Zigzag doble.\n• Saltos dobles en lugar de un pie.\n• Ronda de cachipún al mejor de tres.`,
  imagenes: ["/juegos/Imagen47.png"]
},
{
  id: "juego-48",
  title: "El Pulpo",
  tags: ["equipos", "grupal"],
  description: `Grupos de 4 o 5 personas se enganchan de codo con codo mirando hacia afuera, formando “el pulpo”. A la señal, deben avanzar unidos hasta una zona con objetos pequeños, agacharse coordinadamente sin soltarse, tomar uno y regresar a la base. Esto se repite hasta que termine el tiempo. Puede hacerse más difícil aumentando la distancia, usando objetos más pequeños o exigiendo posturas específicas.`,
  objetivo: `Fomentar cooperación, unión grupal, coordinación y movimiento sincronizado.`,
  materiales: "Objetos pequeños (como lentejas).",
  variantes: `• Objetos más pequeños o resbalosos.\n• Pulpo gigante: juntar dos grupos.\n• Recolección cooperativa: meta común entre todos los pulpos.`,
  imagenes: ["/juegos/Imagen48.png"]
},
{
  id: "juego-49",
  title: "Acrosport",
  tags: ["equipos"],
  description: `Grupos de 4 o 5 personas, con un líder, deben recrear formaciones de acrosport mostradas por el encargado. El líder corre a memorizar la figura y vuelve para guiar al equipo. Si olvida algo, puede regresar cuantas veces necesite. Las figuras tienen una posición opcional para grupos de 4. El primer equipo en recrear correctamente la formación gana un punto. Se juegan rondas durante 10 minutos.`,
  objetivo: `Trabajar fuerza, memoria visual, coordinación grupal, liderazgo y rapidez en ejecución.`,
  materiales: "Espacio amplio en cancha.",
  variantes: `• Formaciones más complejas.\n• Tiempo reducido.\n• Líder secreto: el líder no puede hablar, solo gesticular.`,
  imagenes: ["/juegos/Imagen49.png"]
},
{
  id: "juego-50",
  title: "Letra a Letra",
  tags: ["equipos"],
  description: `Equipos de 7–8 participantes reciben un set de letras idéntico. El anfitrión lee una definición y los equipos deben deducir la palabra y organizarse en fila sosteniendo las letras correctas para que se lean de izquierda a derecha. El más rápido gana el punto. Se puede aumentar la dificultad con palabras más largas, distractores o rondas silenciosas donde no pueden hablar.`,
  objetivo: `Fomentar trabajo en equipo, agilidad mental, liderazgo distribuido, comunicación efectiva y toma rápida de decisiones.`,
  materiales: "Set de letras por equipo.",
  variantes: `• Definiciones engañosas.\n• Palabras que comparten letras.\n• Ronda silenciosa (sin hablar).`,
  imagenes: ["/juegos/Imagen50.png"]
},
];

// ----------------------------
//  COMPONENTES DE UI
// ----------------------------

function NavBar({ current, onChange }) {
  const items = [
    { key: "aplausos", label: "Aplausos", icon: <ClapEmojiIcon className="h-5 w-5" /> },
    { key: "dinamicas", label: "Dinámicas", icon: <SparklesEmoji className="h-5 w-5" /> },
    { key: "juegos", label: "Juegos", icon: <GamesEmoji className="h-5 w-5" /> },
    { key: "nosotros", label: "Nosotros", icon: <Users className="h-5 w-5" /> },
  ];
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <div
          className="flex items-center gap-2 font-semibold text-lg cursor-pointer select-none hover:opacity-90 transition"
          onClick={() => onChange('landing')}
          title="Volver a la portada"
        >
          <BookOpen className="h-6 w-6" />
          <span>Bitácora Ramo Deportivo</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {items.map((it) => (
            <Button
              key={it.key}
              variant={current === it.key ? "default" : "ghost"}
              className={`rounded-full ${current === it.key ? "shadow" : ""}`}
              onClick={() => onChange(it.key)}
            >
              <div className="flex items-center gap-2">
                {it.icon}
                <span className="hidden sm:inline">{it.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ item, onOpen, onTagClick }) {
  return (
    <Card className="hover:shadow-lg border border-blue-100 transition-shadow duration-200">
      {item.imagenes?.length > 0 && (
        <img
          src={item.imagenes[0]}
          alt={item.title}
          className="w-full h-40 object-cover rounded-t-xl"
        />
      )}
      <CardHeader>
        <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 line-clamp-3 mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {sanitizeTags(item.tags).map((t) => (
              <button
                key={t}
                type="button"
                className={`h-7 px-3 rounded-full border border-transparent text-xs transition ${tagClass(t)}`}
                onClick={(e) => {
                  e.stopPropagation();   // no abre el modal
                  onTagClick?.(t);       // filtra por el tag
                }}
                title={`Filtrar por: ${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        <Button onClick={() => onOpen(item)} className="w-full">
          Ver detalle <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ActivityGrid({ data, label }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) =>
      [d.title, ...sanitizeTags(d.tags)].some((x) => x?.toLowerCase().includes(q))
    );
  }, [data, query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <h2 className="text-2xl font-semibold mr-auto">{label}</h2>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            className="pl-9"
            placeholder={`Buscar ${label.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <ActivityCard key={item.id} item={item} onOpen={setSelected} onTagClick={setQuery} />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="w-[min(92vw,720px)]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="prose prose-neutral max-w-none">
                    {/* DESCRIPCIÓN */}
                    {selected.description && (
                      <p className="whitespace-pre-line">
                        {selected.description}
                      </p>
                    )}

                    {/* OBJETIVO */}
                    {selected.objetivo && (
                      <div>
                        <h4 className="font-semibold text-slate-800">Objetivo</h4>
                        <p className="whitespace-pre-line">{selected.objetivo}</p>
                      </div>
                    )}

                    {/* MATERIALES */}
                    {selected.materiales && (
                      <div>
                        <h4 className="font-semibold text-slate-800">Materiales</h4>
                        <p className="whitespace-pre-line">{selected.materiales}</p>
                      </div>
                    )}

                    {/* VARIANTES */}
                    {selected.variantes && (
                      <div>
                        <h4 className="font-semibold text-slate-800">Variantes</h4>
                        <p className="whitespace-pre-line">{selected.variantes}</p>
                      </div>
                    )}

                    {/* IMÁGENES — UNA O VARIAS */}
                    {selected.imagenes?.length > 0 && (
                      <div className="space-y-4 mt-4">
                        {selected.imagenes.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`Imagen ${i + 1}`}
                            className="w-full rounded-xl border shadow-sm"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                {selected.videoUrl ? (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2"><Play className="h-4 w-4"/>Demostración</h4>
                    <VideoPlayer url={selected.videoUrl} />
                  </div>
                ) : null}
                {selected.tags?.length ? (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {sanitizeTags(selected.tags).map((t) => (
                      <Badge key={t} variant="secondary" className={`rounded-full ${tagClass(t)}`}>{t}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VideoModal({ open, onClose, person }) {
  if (!open || !person) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full relative shadow-lg">
        
        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">{person.name}</h2>

        {/* Video */}
        <video controls className="w-full rounded-lg">
          <source src={person.video} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

      </div>
    </div>
  );
}

function Nosotros() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const integrantes = [
    {
      name: "Angel Concha",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/angel.png",
      video: "/videos/angel.mp4",
    },
    {
      name: "Catalina Diez",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/cata.png",
      video: "/videos/cata.mp4",
    },
    {
      name: "Amparo Frugone",
      carrera: "Ingeniería Comercial",
      fotoUrl: "/nosotros/amparo.png",
      video: "/videos/amparo.mp4",
    },
    {
      name: "Antonia Marín",
      carrera: "Ingeniería Civil IDI",
      fotoUrl: "/nosotros/anto.png",
      video: "/videos/anto.mp4",
    },
    {
      name: "Sebastián Musé",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/seba.png",
      video: "/videos/seba.mp4",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-6">Nosotros</h2>

      {/* 🔹 Mantengo el subtítulo tal cual lo solicitaste */}
      <p className="text-neutral-700 mb-6">
        Esta bitácora recopila 50 aplausos, 50 dinámicas y 50 juegos del ramo. Fue diseñada para ser
        clara, rápida y pública: cualquier persona con el enlace puede ver el contenido. 
        Además, al hacer click sobre cada uno de los integrantes, podrán acceder a la reflexión final individual de nosotros!
      </p>

      {/* Grid responsiva para 5 integrantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {integrantes.map((p) => (
          <Card
            key={p.name}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedPerson(p);
              setModalOpen(true);
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-800">{p.name}</CardTitle>
            </CardHeader>

            <CardContent>
              {/* 📷 Foto bajo el nombre */}
              <div className="mb-3">
                <img
                  src={p.fotoUrl}
                  alt={`Foto de ${p.name}`}
                  className="w-full h-48 object-cover rounded-xl border border-slate-200 bg-slate-100"
                />
              </div>

              {/* 🎓 Carrera universitaria */}
              <p className="text-sm text-neutral-700">
                <span className="font-medium">Carrera: </span>
                {p.carrera}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <VideoModal
        open={modalOpen}
        person={selectedPerson}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

// ----------------------------
//  APP PRINCIPAL
// ----------------------------

function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 via-sky-50 to-indigo-200 text-slate-800 px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-700 drop-shadow-sm">
        Liderazgo, Juegos y Recreación I
      </h1>
      <p className="text-xl md:text-2xl mb-2 text-slate-700">2025-2</p>
      <p className="text-lg md:text-xl mb-8 text-slate-600">Grupo: El mejor 😎</p>
      <Button
        onClick={onEnter}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-2xl shadow-lg transition-transform hover:scale-105"
      >
        Entrar a la Bitácora
      </Button>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => sessionStorage.getItem("route") || "landing");
  useEffect(() => {
    sessionStorage.setItem("route", route);
  }, [route]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50">
      {route === "landing" ? (
        <LandingPage onEnter={() => setRoute("aplausos")} />
      ) : (
        <>
          <NavBar current={route} onChange={setRoute} />
          {route === "aplausos" && <ActivityGrid data={APLAUSOS_DATA} label="Aplausos" />}
          {route === "dinamicas" && <ActivityGrid data={DINAMICAS_DATA} label="Dinámicas" />}
          {route === "juegos" && <ActivityGrid data={JUEGOS_DATA} label="Juegos" />}
          {route === "nosotros" && <Nosotros />}
          <footer className="border-t border-neutral-200 mt-8">
            <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-600">

            </div>
          </footer>
        </>
      )}
    </div>
  );
}
