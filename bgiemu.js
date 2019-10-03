let colors = [
  "black",
  "blue",
  "green",
  "cyan",
  "red",
  "magenta",
  "brown",
  "lightgray",
  "darkgray",
  "lightblue",
  "lightgreen",
  "lightcyan",
  "lightred",
  "#E78BE7", // lightmagenta
  "yellow",
  "white",
];

function createBgiContext(c) {
  let ctx = c.getContext("2d");
  //ctx.imageSmoothingEnabled = false;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  let fontSize = 14;
  ctx.font = fontSize + "px monospace";
  let charWidth = ctx.measureText("M").width;
  // console.log('charWidth', charWidth);
  let backgroundStyle = "black";
  let curAction = "";
  let curData = null;
  let curX = 0;
  let curY = 0;
  let buffer = "";
  let audioContext = new AudioContext();
  let oscillator;

  let actionIter;

  function delayHandler() {
    processNextAction();
  }

  function line(x1, y1, x2, y2, style) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (style) {
      ctx.strokeStyle = style;
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function rectangle(x1, y1, x2, y2, style) {
    ctx.beginPath();
    if (style) {
      ctx.strokeStyle = style;
    }
    ctx.rect(x1, y1, (x2 - x1), (y2 - y1));
    ctx.stroke();
  }

  function outtextxy(x, y, str, isVertical) {
    if (isVertical) {
      ctx.save();
      ctx.translate(x, y + (str.length * charWidth));
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(str, 0, fontSize);
      ctx.restore();
      return;
    }
    ctx.fillText(str, x, y + fontSize);
  }

  function cleardevice() {
    ctx.fillStyle = backgroundStyle;
    ctx.rect(0, 0, c.width, c.height);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    curX = 0;
    curY = 0;
  }

  function putpixel(x, y) {
    rectangle(x, y, x + 1, y + 1);
  }

  function fillellipse(x, y, xradius, yradius) {
    ctx.beginPath();
    ctx.ellipse(x, y, xradius, yradius, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  function ellipse(x, y, startangle, endangle, xradius, yradius) {
    ctx.beginPath();
    ctx.ellipse(x, y, xradius, yradius, 0, startangle * 180 / Math.PI, endangle * 180 / Math.PI);
    ctx.stroke();
  }

  function circle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  function printf(str) {
    let fillStyleOrig = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillText(str, curX * charWidth, (curY + 1) * fontSize);
    ctx.fillStyle = fillStyleOrig;
    curX += str.length;
  }

  function processNextAction() {
    while (true) {
      let nextAction = actionIter.next();
      if (nextAction.done) {
        curAction = "";
        return;
      }
      curAction = nextAction.value.name;
      curData = nextAction.value.data;

      switch (curAction) {
        case "Delay":
          setTimeout(delayHandler, curData);
          break;
        case "Line":
          line(curData);
          continue;
      } 
      break;
    }
  }

  function sound(freq) {
    oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.connect(audioContext.destination);
    oscillator.frequency.value = freq;
    oscillator.start();
  }

  function nosound() {
    oscillator.stop();
  }

  c.onkeydown = function (event) {
    if (curAction == "Scanf") {
      if (event.key.length == 1) {
        buffer += event.key;
        let fillStyleOrig = ctx.fillStyle;
        ctx.fillStyle = "white";
        ctx.fillText(event.key, curX * charWidth, (curY + 1) * fontSize);
        ctx.fillStyle = fillStyleOrig;
        curX += 1;
      } else if (event.key == "Enter") {
        console.log("Got input", buffer);
        processNextAction();
      } else if (event.key == "Backspace") {
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          console.log("Removing")
          ctx.beginPath();
          curX -= 1;
          ctx.rect(curX * charWidth, curY * fontSize, charWidth, fontSize);
          let fillStyleOrig = ctx.fillStyle;
          ctx.fillStyle = backgroundStyle;
          ctx.fill();
          ctx.fillStyle = fillStyleOrig;
        }
      }
    } else if (curAction == "GetCh") {
      processNextAction();
    }
  }

  return {
    run(main) {
      actionIter = main();
      processNextAction();
    },
    line,
    outtextxy,
    rectangle,
    setcolor(color) {
      ctx.fillStyle = colors[color];
      ctx.strokeStyle = colors[color];
    },
    settextstyle() { },
    setfillstyle(pattern, color) {
      ctx.fillStyle = colors[color];
    },
    outtextxy,
    getch() {
      return {
        name: "GetCh",
        data: null,
      };
    },
    cleardevice,
    fillellipse,
    putpixel,
    printf,
    scanf(data) {
      buffer = "";
      return {
        name: "Scanf",
        data,
      };
    },
    getScan() {
      let values = buffer.split(' ');
      return curData.map((type, index) => {
        switch (type) {
          case 'Int':
            return Math.floor(Number(values[index]));
          case 'Float':
            return Number(values[index]);
          case 'String':
            return values[index];
          default:
            return values[index];
        }
      });
    },
    delay(duration) {
      return {
        name: "Delay",
        data: duration,
      };
    },
    getbkcolor() {
      return colors.indexOf(backgroundStyle);
    },
    circle,
    ellipse,
    sound,
    nosound,
  }
}