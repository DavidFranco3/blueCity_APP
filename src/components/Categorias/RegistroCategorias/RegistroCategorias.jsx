import { useState } from 'react';
import { registraCategorias } from "../../../api/categorias";
import Dropzone from "../../Dropzone";
import "./RegistroCategorias.scss";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {subeArchivosCloudinary} from "../../../api/cloudinary";
import {toast} from "react-toastify";
import queryString from "query-string";

function RegistroCategorias(props) {
    const { setShowModal, history } = props;
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
            toast.warning("Debes agregar una imagen a la categoría")
        } else {
            if (!formData.nombre) {
                        setLoading(false);
                        toast.warning("Completa el formulario");
                    } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                subeArchivosCloudinary(imagenProducto, "categoria").then(response => {
                    const { data } = response;
                    fotoProducto = data.secure_url;

                        setLoading(true);
                        
                        const dataTemp = {
                        nombre: formData.nombre,
                        imagen: fotoProducto,
                        negocio: "LA NENA"
                    }

                            registraCategorias(dataTemp).then(response =>
                            {
                                const { data } = response;
                                    setLoading(true);
                                    history.push({
                                        search: queryString.stringify(""),
                                    });
                                    toast.success("Categoría registrada");
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
                    <div title="Seleccionar imagen de la categoría" className="imagenProducto">
                        <Dropzone
                            setImagenFile={setImagenProducto}
                            disabled
                        />
                    </div>
                </div>

                <div className="datosDelProducto">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombre"
                                          placeholder="Escribe el nombre"
                                          defaultValue={formData.nombre}
                            />
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title="Registrar categoría"
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={loading}
                            >
                                {!loading ? "Registrar categoría" : <Spinner animation="border" />}
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

function initialFormValue(){
    return {
        nombre: ""
    }
}

export default RegistroCategorias;
