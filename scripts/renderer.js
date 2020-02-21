class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        this.drawRectangle({x: 250, y: 100}, {x: 550, y: 550}, [255, 0, 0, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        this.drawCircle({x: 400, y: 300}, 200, [51, 0, 255, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        this.drawBezierCurve({x: 100, y: 300}, {x: 200, y: 550}, {x: 550, y: 75}, {x: 700, y: 300}, [0, 161, 32, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        this.drawLine({x: 100, y: 400}, {x:100, y: 200}, [161, 0, 129, 255], framebuffer);
        this.drawLine({x: 100, y: 200}, {x:200, y: 200}, [161, 0, 129, 255], framebuffer);
        this.drawCircle({x: 250 , y: 250}, 50, [161, 0, 129, 255], framebuffer);
        this.drawLine({x: 300, y: 250}, {x: 325, y: 200}, [161, 0, 129, 255], framebuffer);
        this.drawBezierCurve({x: 330, y: 300}, {x: 325, y: 170}, {x: 450, y: 170}, {x: 445, y: 300}, [161, 0, 129, 255], framebuffer);
        this.drawLine({x: 460, y: 300}, {x: 460, y: 200}, [161, 0, 129, 255], framebuffer);
        this.drawBezierCurve({x: 460, y: 260}, {x: 460, y: 325}, {x: 525, y: 325}, {x: 535, y: 280}, [161, 0, 129, 255], framebuffer);
        this.drawCircle({x: 600 , y: 250}, 50, [161, 0, 129, 255], framebuffer);
        this.drawLine({x: 650, y: 250}, {x: 675, y: 200}, [161, 0, 129, 255], framebuffer);
        if(this.show_points) {
            this.drawCirclePoint({x: 100, y: 400}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 100, y: 200}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x:200, y: 200}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 300, y: 250}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 325, y: 200}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 460, y: 300}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 460, y: 200}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 650, y: 250}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: 675, y: 200}, [0,0,0,255], framebuffer);
        }
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        this.drawLine(left_bottom, {x: right_top.x, y: left_bottom.y}, color, framebuffer);
        this.drawLine({x: right_top.x, y: left_bottom.y}, right_top, color, framebuffer);
        this.drawLine({x: left_bottom.x, y: right_top.y}, right_top, color, framebuffer);
        this.drawLine({x: left_bottom.x, y: right_top.y}, left_bottom, color, framebuffer);
        if(this.show_points) {
            this.drawCirclePoint(left_bottom, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: right_top.x, y: left_bottom.y}, [0,0,0,255], framebuffer);
            this.drawCirclePoint({x: left_bottom.x, y: right_top.y}, [0,0,0,255], framebuffer);
            this.drawCirclePoint(right_top, [0,0,0,255], framebuffer);
        }
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, color, framebuffer) {
        var theta = 360 / this.num_curve_sections;
        var x = center.x + radius;
        var y = center.y;
        var i;
        var currentAngle = theta;
        for(i = 0; i < this.num_curve_sections; i++) {
            var x1 = Math.round(center.x  + radius * Math.cos(currentAngle * Math.PI / 180));
            var y1 = Math.round(center.y + radius * Math.sin(currentAngle * Math.PI / 180));
            this.drawLine({x: x, y: y}, {x: x1, y: y1}, color, framebuffer);
            if(this.show_points) {
                this.drawCirclePoint({x: x1, y: y1}, [0,0,0,255], framebuffer);
            }
            x = x1;
            y = y1;
            currentAngle += theta;
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        if(this.show_points) {
            this.drawCirclePoint(pt1, [255,0,0,255], framebuffer);
            this.drawCirclePoint(pt2, [255,0,0,255], framebuffer);
        }
        var x1, y1, i;
        var t = 0;
        var dt = 1.0 / this.num_curve_sections;
        var x = pt0.x;
        var y = pt0.y
        for(i = 0; i <= this.num_curve_sections; i++) {
            x1 = Math.round(Math.pow(1-t, 3) * pt0.x + 3 * Math.pow(1-t, 2) * t * pt1.x + 3 * (1-t) * Math.pow(t, 2) * pt2.x + Math.pow(t, 3) * pt3.x);
            y1 = Math.round(Math.pow(1-t, 3) * pt0.y + 3 * Math.pow(1-t, 2) * t * pt1.y + 3 * (1-t) * Math.pow(t, 2) * pt2.y + Math.pow(t, 3) * pt3.y);

            this.drawLine({x: x, y: y}, {x: x1, y: y1}, color, framebuffer);
            if(this.show_points) {
                this.drawCirclePoint({x: x1, y: y1}, [0,0,0,255], framebuffer);
            }
            x = x1;
            y = y1;

            t = t + dt;
        }
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCirclePoint(center, color, framebuffer) {
        var theta = 10
        var x = center.x + 5;
        var y = center.y;
        var i;
        var currentAngle = theta;
        for(i = 0; i < 36; i++) {
            var x1 = Math.round(center.x  + 5 * Math.cos(currentAngle * Math.PI / 180));
            var y1 = Math.round(center.y + 5 * Math.sin(currentAngle * Math.PI / 180));
            this.drawLine({x: x, y: y}, {x: x1, y: y1}, color, framebuffer);
            x = x1;
            y = y1;
            currentAngle += theta;
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLine(pt0, pt1, color, framebuffer)
    {
        // if our slope is less than or equal to 1
        if (Math.abs(pt1.y - pt0.y) <= Math.abs(pt1.x - pt0.x)) {
            if (pt0.x < pt1.x) {
                this.drawLineLow(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
            }
            else {
                this.drawLineLow(pt1.x, pt1.y, pt0.x, pt0.y, color, framebuffer);
            }
        }
        // the slope is greater than 1
        else {
            if (pt0.y < pt1.y) {
                this.drawLineHigh(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
            }
            else {
                this.drawLineHigh(pt1.x, pt1.y, pt0.x, pt0.y, color, framebuffer);
            }
        }


    }

    // x0:           the x value of the first point
    // y0:           the y value of the first point
    // x1:           the x value of the second point
    // y1:           the y value of the second point
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
        var A = y1 - y0;
        var B = x0 - x1;
        var iy = 1;
        // if the slope is negative
        if(A < 0) {
            // we want to decrement y instead of incrementing
            iy = -1;
            // change A back to positive to compare with that line
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        var px;
        
        while (x <= x1) {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            x += 1;
            if (D <= 0) {
                D+= 2 * A;
            }
            else {
                D += 2 * A + 2 * B;
                y += iy;
            }
        }
    }
        
    // x0:           the x value of the first point
    // y0:           the y value of the first point
    // x1:           the x value of the second point
    // y1:           the y value of the second point
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
        var A = x1 - x0;
        var B = y0 - y1;
        var ix = 1;
        // if the slope is negative
        if(A < 0) {
            // we want to decrement y instead of incrementing
            ix = -1;
            // change A back to positive to compare with that line
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        var px;
        
        while (y <= y1) {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            y += 1;
            if (D <= 0) {
                D+= 2 * A;
            }
            else {
                D += 2 * A + 2 * B;
                x += ix;
            }
        }
    }

    // x:            the x value of the indicated point
    // y:            the y value of the indicated point
    // framebuffer:  canvas ctx image data
    pixelIndex(x, y, framebuffer) {
        return 4 * y * framebuffer.width + 4 * x;
    }

    // framebuffer:  canvas ctx image data
    // px:           the indicated pixel
    // color:        array of int [R, G, B, A]
    setFramebufferColor(framebuffer, px, color) {
        framebuffer.data[px + 0] = color[0];
        framebuffer.data[px + 1] = color[1];
        framebuffer.data[px + 2] = color[2];
        framebuffer.data[px + 3] = color[3];
    }

};
