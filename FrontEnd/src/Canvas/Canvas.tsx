import "./Canvas.css"
import { useEffect, useRef, useState } from "react"
import { useSocket } from "../Socket/socket"
import PopUp from "./PopUp";
import { useAuth } from "../AuthContext/authcontext";

interface point {
    x: number,
    y: number
}

interface Stroke {
    strokeWidth: number,
    strokeColor: string,
    madeBy: string,
    points: point[]
}

const Canvas = () => {

    const auth = useAuth();

    const isDrawing = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevpoint = useRef<{ x: number, y: number } | null>(null);
    const [codeinpout, setcodeinput] = useState<string>("");

    const currentStroke = useRef<Stroke | null>(null);

    const [invitecode, setinvitecode] = useState<string>("-");
    const [requests, setrequests] = useState<{ userId: string, roomCode: string }[]>([])
    const socket = useSocket();
    const [roomjoined, setroomjoined] = useState<string | null>(null);
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

    const drawthestrokes = (strokes: Array<Stroke>) => {

        if (ctxRef.current === null) return;

        if (strokes.length === 0) return;




        for (let i = 0; i < (strokes.length); i++) {

            ctxRef.current?.beginPath();
            if (!canvasRef.current) return;
            if (strokes[i] === null || strokes[i].points.length === 0) continue;
            ctxRef.current?.moveTo(canvasRef.current?.width * strokes[i].points[0].x, canvasRef.current.height * strokes[i].points[0].y);

            ctxRef.current.lineWidth = 5;
            ctxRef.current.lineCap = "round";
            ctxRef.current.strokeStyle = "white"
            for (let j = 1; j < strokes[i].points.length; j++) {
                ctxRef.current?.lineTo(strokes[i].points[j].x * canvasRef.current.width, strokes[i].points[j].y * canvasRef.current.height);
            }
            ctxRef.current?.stroke();

        }


    }


    const acceptrequest = (userId: string, roomCode: string) => {
        const data = {
            userId,
            roomCode
        }
        socket.current?.emit("accept-request", data)
        setrequests(requests.filter((item) => item.userId !== userId));
    }
    const rejectrequest = (userId: string, roomCode: string) => {

        socket.current?.emit("reject-request", { userId, roomCode });

        setrequests(requests.filter((item) => item.userId !== userId));
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
            console.log("undraw fired .... ");
            prevpoint.current = null;
        }

        const setcode = (code: string) => {

            setinvitecode(code);
        }

        const handlejoinrequest = ({ userID, roomCode }: { userID: string, roomCode: string }) => {

            // alert(`${userID} wants to join`); // render the ask component here.
            console.log(userID);
            console.log(roomCode);
            setrequests((prev) => [...prev, { userId: userID, roomCode: roomCode }]);
            console.log(requests);



        }

        const handleroomjoined = (roomCode: string, strokes: Array<Stroke>) => {
            alert(`${roomCode} joined successfully`);
            console.log(strokes);
            drawthestrokes(strokes);
            setroomjoined(roomCode);

        }

        const handlenotjoined = (roomCode: string) => {
            alert(`${roomCode} joined rejected`);
        }

        socket.current?.on("draw", handledraw);
        socket.current?.on("undraw", handleundraw);
        socket.current?.on("board-created", setcode);
        socket.current?.on("joined-room", handleroomjoined);
        socket.current?.on("join-request", handlejoinrequest);
        socket.current?.on("not-joined-room", handlenotjoined)


        return () => {
            socket.current?.off("draw", handledraw);
            socket.current?.off("undraw", handleundraw);
            socket.current?.off("board-created", setcode);
            socket.current?.off("join-request", handlejoinrequest);
            socket.current?.off("joined-room", handleroomjoined);
            socket.current?.off("not-joined-room", handlenotjoined)
        }



    }, [])







    const startDrawing = (e: any) => {
        isDrawing.current = (true);


        console.log("Started drawing");

        ctxRef.current?.beginPath();
        const { x, y } = getMousePos(e);
        ctxRef.current?.moveTo(x, y);
        if (!canvasRef.current) return;


        currentStroke.current = {
            strokeColor: "white",
            strokeWidth: 5,
            points: [{ x: x / canvasRef.current?.width, y: y / canvasRef.current.height }],
            madeBy: auth._id as string
        }
        socket.current?.emit("draw", { x, y });
    }

    const drawing = (e: any) => {

        if (!isDrawing.current) return;
        // console.log(e) ;

        // console.log("drawing");
        if (!ctxRef.current || !canvasRef.current) return;
        const { x, y } = getMousePos(e);
        ctxRef.current.lineTo(x, y);
        currentStroke.current?.points.push({ x: x / canvasRef.current?.width, y: y / canvasRef.current.height });
        ctxRef.current.stroke();
        socket.current?.emit("draw", { x, y, invitecode });

    }

    const stopDrawing = () => {
        isDrawing.current = (false);
        console.log("Drawing Stopped");
        if(currentStroke.current)
            socket.current?.emit("undraw", invitecode, currentStroke.current);
        currentStroke.current = null;
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

                    {roomjoined === null ?


                        <>
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
                        </>
                        : <>
                            <div className="room-joined-heading">
                                Room {roomjoined} joined.

                            </div>
                            <div className="left-room">
                                <button className="leave-room-button" onClick={() => {
                                    socket.current?.emit("leave-room");
                                    setroomjoined(null);

                                }}> Leave Board </button>
                            </div>
                        </>
                    }

                </div>

                <div className="request-popup">
                    {
                        requests.length === 0 ? <></> :
                            requests.map((userIds, index) => (
                                <PopUp userId={userIds.userId} key={index}
                                    roomCode={userIds.roomCode}
                                    acceptrequest={acceptrequest}
                                    rejectrequest={rejectrequest}


                                />
                            ))


                    }
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