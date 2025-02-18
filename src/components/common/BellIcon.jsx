import { FaRegBell } from "react-icons/fa"

const BellIcon = () => {
  return (
    <div>
        <div style={{backgroundColor:"white",padding:'10px',borderRadius:'5px',position:'fixed',top:'1rem',right:'1rem',zIndex:'99999'}}><FaRegBell style={{fontSize:'25px'}} /></div>
    </div>
  )
}

export default BellIcon
