let HORIZ_DIR = 0;
let SMALL_FONT = 0;

function myApp(context) {
  return function* main() {
    /*float */ let y, t2, v, t1, x0 = 50, y0 = 400, y1, r = 7, g = 9.81, h, f, ec, xp =[] /*50 */, yp = [] /* 50 */;
    /* int */ let i = 0, j, k, ch, i1, s0 = [
      1100,
      500,
      250,
      300,
      700,
      500,
      300
    ], so, time, j1 = 17;
    /* char */ let str1, str2;
    /* void * */ let buffer;
    //int gdriver = DETECT, gmode, errorcode;
    //initgraph( & gdriver, & gmode, "");
    /* Discription of the program */
    context.line(1, 350, 648, 350);
    context.rectangle(1, 1, 638, 478);
    context.setcolor(2);
    context.settextstyle(1, HORIZ_DIR, 4);
    context.outtextxy(240, 10, "Bounce");
    context.settextstyle(1, HORIZ_DIR, 3);
    context.outtextxy(20, 60, "     The program shows repeated bounce of the");
    context.outtextxy(20, 90, " ball. The effect of coefficient of restitution ");
    context.outtextxy(20, 120, " 'e' on bounce is shown");
    context.outtextxy(20, 160, "    If e=0 ball material is plastic like wax and");
    context.outtextxy(20, 190, " it shows no bounce.  ");
    context.outtextxy(20, 230, "    If e=1 it is perfectly elastic material and ");
    context.outtextxy(20, 260, " will continue to bounce indefinately.");
    context.outtextxy(20, 300, " bounce height is root 'e' times release height");
    context.setcolor(5);
    context.outtextxy(20, 380, "   Program by Dr.V.D.Barve with the help of ");
    context.outtextxy(20, 420, "                 Uday Bal ");
    yield context.getch();
    context.cleardevice(); /* Change of frame */

    while (1) {
      h = 350;
      j = 1;
      //initgraph( & gdriver, & gmode, "");
      context.fillellipse(x0, y0 - 350, r, r);
      context.line(20, y0 + 8, 650, y0 + 8);
      context.line(x0 + 100, 20, x0 + 100, 500);
      context.settextstyle(1, 0, 0);
      context.setcolor(7);
      context.outtextxy(x0 + 150, y0 + 30, " Bounce number -->");
      context.settextstyle(1, 1, 0);
      context.outtextxy(x0 + 30, y0 - 375, "Height in cms-->", true);
      context.settextstyle(SMALL_FONT, 0, 4);
      context.setcolor(2);
      /* Drawing Grass */
      for (i1 = 25; i1 <= 115; i1 = i1 + 10) {
        context.line(i1, y0 + 9, i1 - 5, y0 + 14);
      }
      /* Drawing Verticle Scale */
      for (i1 = 0; i1 <= 350; i1 = i1 + 50) {
        context.putpixel(x0 + 98, y0 - i1, 7);
        str1 = String(i1); //sprintf(str1, "%d", i1);
        context.outtextxy(x0 + 70, y0 - i1 - 5, str1);
      }
      /* Drawing Horizontal Scale */
      for (i1 = 0; i1 <= 17; i1 = i1 + 1) {
        context.putpixel(x0 + 110 + i1 * 25, y0 + 8, 7);
        str2 = String(i1); //sprintf(str2, "%d", i1);
        context.outtextxy(x0 + 110 + i1 * 25, y0 + 18, str2);
      }
      context.printf("Give e between 0-1  & delay (1 --> 10) (two -ve values to stop) ");
      context.setcolor(13);
      yield context.scanf(['Float', 'Int']);
      [ec, time] = context.getScan();
      if (ec < 0 | ec > 1.3) break;
      j1 = 50;
      xp[1] = x0 + 110;
      yp[1] = y0 - h;
      context.circle(xp[1], yp[1] + r, 2);
      t2 = Math.sqrt(2 * h / g);
      v = Math.sqrt(2 * g * h);
      do {
        i = i + 1;
        /* Dowmward motion of the ball */
        /* Due to anti-aliasing, the ball doesn't get erased properly
            when drawn in black color with same size. Added +1 to 
            radius when erasing. Added -1 to y coordinate to compensate
            hitting on ground coordinate. */
        for (t1 = 0; t1 <= t2; t1 = t1 + 0.2) {
          y = y0 - h + 0.5 * g * t1 * t1;
          context.setfillstyle(1, 15);
          context.fillellipse(x0, y-1, r, r);
          context.setcolor(15);
          context.ellipse(x0, y-1, 0, 360, r, r);
          yield context.delay(10 * time);
          context.setfillstyle(1, 0);
          context.fillellipse(x0, y-1, r+1, r+1);
          context.setcolor(0);
          context.ellipse(x0, y-1, 0, 360, r+1, r+1);
        }
        /* initialisation for upward motion */
        v = ec * v;
        t2 = v / g;
        j = j + 1;
        for (so = 0; so < 6; so++) {
          context.sound(s0[so]);
          yield context.delay(5 * time);
          context.nosound();
        }
        for (t1 = 0; t1 <= t2; t1 = t1 + 0.2) {
          y = y0 - v * t1 + 0.5 * g * t1 * t1;
          context.setfillstyle(1, 15);
          context.fillellipse(x0, y-1, r, r);
          context.setcolor(15);
          context.ellipse(x0, y-1, 0, 360, r, r);
          yield context.delay(10 * time);
          context.setfillstyle(1, 0);
          context.fillellipse(x0, y-1, r+1, r+1);
          context.setcolor(0);
          context.ellipse(x0, y-1, 0, 360, r+1, r+1);
        }
        /* Plotting the graph */
        context.setcolor(13);
        xp[j] = xp[j - 1] + 25;
        yp[j] = y;
        context.circle(xp[j], yp[j] + r, 2);
        context.line(xp[j - 1], yp[j - 1] + r, xp[j], yp[j] + r);
        context.setcolor(context.getbkcolor());
        h = y0 - y;
        if (ec > 0.95) j1 = 10;
      } while (t2 > .1 && j < j1);
      if (j1 < 11) {
        context.setcolor(10);
        context.settextstyle(1, 0, 0);
        context.outtextxy(300, 300, "I am tired");
      }
      /* Redraw the ball */
      context.setcolor(15);
      context.ellipse(x0, y, 0, 360, r, r);
      context.setfillstyle(1, 15);
      context.fillellipse(x0, y0 - h, r, r);
      yield context.getch();
      context.cleardevice();
    }
    /* getch();*/
    context.closegraph();
  
  }
}
