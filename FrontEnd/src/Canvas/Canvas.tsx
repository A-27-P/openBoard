import "./Canvas.css"
import { useEffect, useRef } from "react"


const Canvas = () => {

    const isDrawing = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);





    const startDrawing = (e: any) => {
        isDrawing.current = (true);

        console.log("Started drawing");

        ctxRef.current?.beginPath();
        ctxRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }

    const drawing = (e: any) => {

        if (!isDrawing.current) return;
        // console.log(e) ;

        // console.log("drawing");
        if (!ctxRef.current) return;
        ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctxRef.current.stroke();
        console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }

    const stopDrawing = () => {
        isDrawing.current = (false);

        console.log("Drawing Stopped");
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "white"


        ctxRef.current = ctx;

    }, [])




    return (
        <div>




            <canvas className="canvas"
                onMouseDown={startDrawing}
                onMouseMove={drawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                ref={canvasRef}
            />





        </div>
    )
}

export default Canvas