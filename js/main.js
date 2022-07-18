window.addEventListener("load", () => {

    const startScan = () => {

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.getElementById("camera"),
                constraints: {
                    decodeBarCodeRate: 3,
                    successTimeout: 500,
                    codeRepetition: true,
                    tryVertical: true,
                    frameRate: 15,
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: [
                    "i2of5_reader"
                ]
            }
        }, err => {
            if(err) {
                console.error(err);
                return;
            }

            Quagga.start();

            _scannerIsRunning = true;
        });

        Quagga.onProcessed(result => {

            let drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if(result) {
                if(result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(box => {
                        return box !== result.box;
                    }).forEach(box => {
                        Quagga.ImageDebug.drawPath(box, {
                            x: 0,
                            y: 1
                        }, drawingCtx, {
                            color: "green",
                            lineWidth: 2
                        });
                    });
                }

                if(result.box) {
                    Quagga.ImageDebug.drawPath(result.box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "#00F",
                        lineWidth: 2
                    });
                }

                if(result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, {
                        x: 'x',
                        y: 'y'
                    }, drawingCtx, {
                        color: 'red',
                        lineWidth: 3
                    });
                }
            }

        });

        Quagga.onDetected(function (result) {
            console.log(result.codeResult.code);
        });

    }
    startScan();

});