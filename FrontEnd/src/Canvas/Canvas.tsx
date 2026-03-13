import "./Canvas.css"
import { useEffect, useRef } from "react"


const Canvas = () => {

    const isDrawing = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const getMousePos = (e: any) => {
        const canvas = canvasRef.current!


        const rect = canvas.getBoundingClientRect()

        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY


        return {
            x,
            y
        }
    }



    const startDrawing = (e: any) => {
        isDrawing.current = (true);

        console.log("Started drawing");

        ctxRef.current?.beginPath();
        const { x, y } = getMousePos(e);
        ctxRef.current?.moveTo(x, y);
    }

    const drawing = (e: any) => {

        if (!isDrawing.current) return;
        // console.log(e) ;

        // console.log("drawing");
        if (!ctxRef.current) return;
        const { x, y } = getMousePos(e);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();

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