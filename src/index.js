// An example of how you tell webpack to use a CSS (SCSS) file
import Swal from 'sweetalert2'
import './css/base.scss';

const testBtn = document.getElementById('testBtn')
testBtn.addEventListener('click', fireSA)

function fireSA () {
  Swal.fire('Testing number two')
}
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'

// getRooms = () => {
//   fetch()
//     .then(response => response.json())
// }