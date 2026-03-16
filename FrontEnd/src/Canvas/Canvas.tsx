import "./Canvas.css"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "../Socket/socket"
import PopUp from "./popUp";


const Canvas = () => {


    const isDrawing = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevpoint = useRef<{ x: number, y: number } | null>(null);
    const [codeinpout, setcodeinput] = useState<string>("");
    const [invitecode, setinvitecode] = useState<string>("-");

    const socket = useSocket();
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

    useEffect(() => {

        if (!socket) return;

        const handledraw = (data: any) => {
            if (prevpoint.current) {
                ctxRef.current?.beginPath();

                ctxRef.current?.moveTo(prevpoint.current.x, prevpoint.current.y);
                ctxRef.current?.lineTo(data.x, data.y);
                ctxRef.current?.stroke();

            }
            prevpoint.current = data;
        }
        const handleundraw = () => {
            prevpoint.current = null;
        }

        const setcode = (code: string) => {
            setinvitecode(code);
        }

        const handlejoinrequest = (userID: string) => {

            alert(`${userID} wants to join`); // render the ask component here.



        }




        socket.current?.on("draw", handledraw);
        socket.current?.on("undraw", handleundraw);
        socket.current?.on("board-created", setcode);

        socket.current?.on("join-request", handlejoinrequest);



        return () => {
            socket.current?.off("draw", handledraw);
            socket.current?.off("undraw", handleundraw);
            socket.current?.off("board-created", setcode);
            socket.current?.off("join-request", handlejoinrequest);
        }



    }, [])







    const startDrawing = (e: any) => {
        isDrawing.current = (true);


        console.log("Started drawing");

        ctxRef.current?.beginPath();
        const { x, y } = getMousePos(e);
        ctxRef.current?.moveTo(x, y);
        socket.current?.emit("draw", { x, y });
    }

    const drawing = (e: any) => {

        if (!isDrawing.current) return;
        // console.log(e) ;

        // console.log("drawing");
        if (!ctxRef.current) return;
        const { x, y } = getMousePos(e);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        socket.current?.emit("draw", { x, y, invitecode });

    }

    const stopDrawing = () => {
        isDrawing.current = (false);
        console.log("Drawing Stopped");
        socket.current?.emit("undraw", (invitecode));
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

    useEffect(() => {
        socket.current?.emit("create-board");
    }, [])

    const joinroomfun = () => {
        if (codeinpout.length !== 6) {
            alert("Please Enter the 6 digit code !");
            return;
        }


        socket.current?.emit("request-join", codeinpout);


    }




    return (
        <div className="canvas-page-div">

            <div className="canvas-header">
                <div className="rooms-join">
                    <div className="invite-code">
                        Invite Code: {invitecode}
                    </div>
                    <div className="roomjoin">
                        <div className="textinput">
                            <input type="text" onChange={(e) => setcodeinput(e.target.value)} />
                        </div>
                        <div className="joinroombutton"
                            onClick={joinroomfun}
                        >
                            Join Board
                        </div>
                    </div>

                </div>

                <div className="request-popup">
                   <PopUp />
                </div>
            </div>




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