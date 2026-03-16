import "./PopUp.css"

const PopUp = ({userId, acceptrequest, rejectrequest} : {userId : any, acceptrequest: Function, rejectrequest: Function}) => {
    console.log(userId.userId) ;
  return (
    <div className='popup-main'>
        
        <div className="popup-heading">
            {userId.userId} 
        </div>
        <div className="popup-buttons">
            <button className="accept-button" onClick={() => acceptrequest(userId)}>
                Accept
            </button>
            <button className="reject-button" onClick={() => rejectrequest(userId)}>
                Reject
            </button>
        </div>
    


    </div>
  )
}

export default PopUp