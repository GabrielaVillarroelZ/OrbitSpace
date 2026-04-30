import Swal from 'sweetalert2';


export const AlertaEspacial = Swal.mixin({
  background: '#0a0515',
  color: '#ffffff',
  confirmButtonColor: '#d946ef', 
  cancelButtonColor: '#3b0764', 
  customClass: {
    container: 'z-[99999]',
    popup: 'border border-purple-500/30 rounded-[2rem] shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    title: 'text-white font-bold',
    confirmButton: 'rounded-xl font-bold px-6 py-2',
    cancelButton: 'rounded-xl font-bold px-6 py-2'
  }
});

export const ToastEspacial = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1a0b36',
  color: '#ffffff',
  iconColor: '#d946ef',
  customClass: {
    container: 'z-[99999]',
    popup: 'border border-purple-500/20 rounded-2xl'
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});