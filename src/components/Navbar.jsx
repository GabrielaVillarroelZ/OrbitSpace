import { Link } from "react-router-dom";

function Navbar() {
    return (

        <nav className="flex justify-between item-center p-6">

            <h1 className="text-xl font-bold">
                
                OrbitSpace
                
                </h1>

                <Link to="/login">
                
                <button classname="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">
                    Login
                </button>

                </Link>
        </nav>
    )
}

export default Navbar;