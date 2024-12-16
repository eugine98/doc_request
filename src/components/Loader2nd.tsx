// import React from 'react';
import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
import { LoaderCircle   } from 'lucide-react';

function Loader2nd() {
  return (
    <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
          {/* <CircularProgress color="inherit" /> */}
          <LoaderCircle size={25} className='animate-spin'/>
      </Backdrop>
  );
}

export default Loader2nd;
