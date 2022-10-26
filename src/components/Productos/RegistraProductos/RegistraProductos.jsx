import { useState } from 'react';
import { Button, Col, Form, Row, Spinner} from "react-bootstrap";
import { toast } from "react-toastify";
import {map} from "lodash";
import { registraProductos } from "../../../api/productos";
import queryString from "query-string";
import Dropzone from "../../Dropzone";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import "./RegistraProductos.scss";

function RegistraProductos(props) {
    const { setShowModal, history, listCategorias } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [loading, setLoading] = useState(false);

    //Para almacenar la imagen del producto que se guardara a la bd
    const [imagenProducto, setImagenProducto] = useState(null);
    
    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

        const onSubmit = e => {
        e.preventDefault();

        let fotoProducto = ""
        if(!imagenProducto) {
            toast.warning("Debes agregar una imagen al producto")
        } else {
            if (!formData.nombre || !formData.categoria || !formData.precio) {
                        setLoading(false);
                        toast.warning("Completa el formulario");
                    } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                subeArchivosCloudinary(imagenProducto, "productos").then(response => {
                    const { data } = response;
                    fotoProducto = data.secure_url;

                        setLoading(true);
                        
                        const dataTemp = {
                        ...formData,
                        imagen: fotoProducto,
                        negocio: "LA NENA"
                    }

                            registraProductos(dataTemp).then(response =>
                            {
                                const { data } = response;
                                    setLoading(true);
                                    history.push({
                                        search: queryString.stringify(""),
                                    });
                                    toast.success("Producto registrado");
                                    setShowModal(false);
                                
                            })
                        
                }).then(e => {
                    //console.log(e)
                })
            } catch (e) {
                //console.log(e)
            }
        }
    }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };  

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <div className="imagenPrincipal">
                    <h4 className="textoImagenPrincipal">Sube tu imagen</h4>
                    <div title="Seleccionar imagen del producto" className="imagenProducto">
                        <Dropzone
                            setImagenFile={setImagenProducto}
                        />
                    </div>
                </div>

                <div className="datosDelProducto">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" name="nombre"
                                placeholder="Escribe el nombre"
                                defaultValue={formData.nombre}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCategoria">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control 
                                 as="select"
                                 defaultValue={formData.categoria}
                                 name="categoria" 
                                 >
                                <option>Elige una opción</option>
                                {map(listCategorias, (cat, index) => (
                                    <option key={index} value={cat?.id}>{cat?.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPrecio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="text" name="precio"
                                          placeholder="Precio"
                                          defaultValue={formData.precio}
                            />
                        </Form.Group>
                    </Row>
                </div> 
                
                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title="Registrar producto" 
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={loading}
                            >
                                {!loading ? "Registrar producto" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                title="Cerrar ventana" 
                                variant="danger"
                                className="cancelar"
                                disabled={loading}
                                onClick={() => {
                                    cancelarRegistro()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
            </Form>
        </>
    );
}

function initialFormValue() {
    return {
        nombre: "",
        categoria: "",
        precio: ""
    }
}

export default RegistraProductos;
