import Backdrop from '@mui/material/Backdrop';
import { ImSpinner2 } from "react-icons/im";

function Loader2nd() {
  return (
    <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
          {/* <CircularProgress color="inherit" /> */}
          <ImSpinner2 size={25} className='animate-spin'/>
      </Backdrop>
  );
}

export default Loader2nd;
