import { FaRegBell } from "react-icons/fa"
import { HiOutlineBars3BottomLeft } from "react-icons/hi2"

const BellIcon = () => {
  return (
    <div>
        <div style={{backgroundColor:"white",width:'30px',height:'30px',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'5px',position:'fixed',top:'1rem',right:'1rem',zIndex:'99999'}}><FaRegBell style={{fontSize:'25px'}} /></div>
        <div style={{backgroundColor:"#6CCEE6",width:'30px',height:'30px',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'5px',position:'fixed',top:'1rem',left:'1rem',zIndex:'99999'}}><HiOutlineBars3BottomLeft  style={{fontSize:'20px',}} /></div>
    </div>
  )
}

export default BellIcon
