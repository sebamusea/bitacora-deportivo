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
    titulo: "Aram Sam Sam",
    descripcion: `En esta actividad, los estudiantes se ponen de pie y acompañan la canción con una serie de movimientos coordinados. La letra es:

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
    titulo: "Cazador, León y Escopeta",
    descripcion: `La dinámica consiste en coordinar equipos mediante mímicas. El grupo se separa en dos equipos, y cada uno elige discretamente una de las tres opciones: cazador, león o escopeta. Luego, a la cuenta de tres, ambos equipos se dan vuelta mostrando su elección mediante una mímica.

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
    titulo: "Larai lai lero",
    descripcion: `Esta dinámica consiste en acompañar la canción:

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
    titulo: "El noble duque Juan",
    descripcion: `El profesor canta la canción:

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
    titulo: "Un día Noé, en su arca partió",
    descripcion: `Los estudiantes cantan la canción:

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
    titulo: "Evolución",
    descripcion: `Todos los participantes comienzan como “Amebas”. Para avanzar de nivel deben jugar cachipún con personas del mismo nivel.

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
    titulo: "Hay un hoyo en el fondo de la mar",
    descripcion: `Dinámica basada en la canción acumulativa que parte con:

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
    titulo: "Tilín tilón osito regalón",
    descripcion: `La dinámica sigue la canción:

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
    titulo: "Ay llepo, wi tai tai llepo",
    descripcion: `En parejas sentadas frente a frente, deben mover una pelotita siguiendo el ritmo de:

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
    titulo: "Cabeza, cabeza boca, mano codo",
    descripcion: `Dinámica acumulativa donde cada palabra corresponde a una acción corporal: cabeza, boca, mano, codo, pie, rodilla, media vuelta, vuelta entera, medio salto, salto entero, medio paso, paso entero.

La secuencia se repite agregando progresivamente cada movimiento hasta hacerlos todos en orden.`,
    objetivo: `Desarrollar memoria motora, coordinación y ejecución rápida de secuencias corporales.`,
    materiales: `No requiere materiales.`,
    variantes: `Realizar la secuencia en orden invertido o aumentar la velocidad.`
  },
  ...makePlaceholders("Dinámica", 50, "grupo"),
];

const JUEGOS_DATA = [
  ...makePlaceholders("Juego", 50, "lúdico"),
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

function Nosotros() {
  const integrantes = [
    {
      name: "Angel Concha",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/angel.jpg",
    },
    {
      name: "Catalina Diez",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/catalina.jpg",
    },
    {
      name: "Amparo Frugone",
      carrera: "?",
      fotoUrl: "/nosotros/amparo.jpg",
    },
    {
      name: "Antonia Marín",
      carrera: "Ingeniería Civil IDI",
      fotoUrl: "/nosotros/antonia.jpg",
    },
    {
      name: "Sebastián Musé",
      carrera: "Ingeniería Civil Industrial TI",
      fotoUrl: "/nosotros/sebastian.jpg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-6">Nosotros</h2>

      {/* 🔹 Mantengo el subtítulo tal cual lo solicitaste */}
      <p className="text-neutral-700 mb-6">
        Esta bitácora recopila 50 aplausos, 50 dinámicas y 50 juegos del ramo. Fue diseñada para ser
        clara, rápida y pública: cualquier persona con el enlace puede ver el contenido.
      </p>

      {/* Grid responsiva para 5 integrantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {integrantes.map((p) => (
          <Card key={p.name} className="hover:shadow-lg transition-shadow">
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
