import {useEffect, Fragment} from 'react';
import "./Menu.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Producto from "../Producto";
import Categoria from "../Categoria";
import {getTokenApi, isExpiredToken, logoutApi} from "../../api/auth";
import {toast} from "react-toastify";

function Menu(props) {
    const { addItems, setRefreshCheckLogin, listProductos, listCategorias, setCategoriaActual, categoriaActual } = props;

    //console.log(listCategorias)

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, [setRefreshCheckLogin]);
    // Termina cerrado de sesión automatico

    const clickHandler = (product) => {
        addItems(product);
    }

    const clickHomeHandler = () => {
        setCategoriaActual("")
    }

    return (
        <>
            <div className="menu">
                <div className="regresarCategorias">
                    <FontAwesomeIcon
                        icon={faHouse}
                        className="home"
                        title="Regresar"
                        onClick={() => {
                            clickHomeHandler()
                        }}
                    />
                </div>
                {
                    !categoriaActual ?
                        (
                            listCategorias &&
                            (
                                listCategorias.map((categoria, index) => {
                                    return(
                                        <button key={index} 
                                                title={categoria.nombre}
                                                onClick={() => setCategoriaActual(categoria.id)}>
                                            <Categoria key={index}
                                                       imagen={categoria.imagen}
                                                       nombre={categoria.nombre}
                                            />
                                        </button>
                                    )
                                })
                            )
                        )
                        :
                        (
                            <>
                                {
                                    listProductos &&
                                    (
                                        listProductos.map((product, index) => {
                                            return(
                                                <button key={index}
                                                        title={product.nombre + " " + "$"+product.precio}
                                                        onClick={() => clickHandler(product)}>
                                                    <Producto key={index}
                                                              imagen={product.imagen}
                                                              nombre={product.nombre}
                                                              precio={product.precio}
                                                    />
                                                </button>
                                            )
                                        })
                                    )
                            
                                }
                            </>
                        )
                        
                }
            </div>
        </>
    );
}

export default Menu;
