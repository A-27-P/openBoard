import "./PopUp.css"

const PopUp = ({userId, acceptrequest, rejectrequest, roomCode} : {userId : string, acceptrequest: Function, rejectrequest: Function, roomCode: string}) => {
    
    console.log("userid",userId)
  return (
    <div className='popup-main'>
        
        <div className="popup-heading">
            {userId} 
        </div>
        <div className="popup-buttons">
            <button className="accept-button" onClick={() => acceptrequest(userId, roomCode)}>
                Accept
            </button>
            <button className="reject-button" onClick={() => rejectrequest(userId, roomCode)}>
                Reject
            </button>
        </div>
    


    </div>
  )
}

export default PopUp