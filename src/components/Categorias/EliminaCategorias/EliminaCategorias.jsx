import { useState } from 'react';
import {Button, Col, Form, Row, Spinner, Alert} from "react-bootstrap";
import {eliminaCategoria} from "../../../api/categorias";
import {toast} from "react-toastify";
import queryString from "query-string";
import moment from "moment";
import "moment/locale/es";
import "../../../scss/styles.scss";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function EliminaCategorias(props) {
    const { datosCategoria, history, setShowModal } = props;
    const { id, nombre, fechaActualizacion } = datosCategoria;

    moment.locale("es");
    
    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }


    const [loading, setLoading] = useState(null);

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        try {
            eliminaCategoria(id).then(response => {
                const { data } = response;
                toast.success(data.mensaje)
                setLoading(false);
                history.push({
                    search: queryString.stringify(""),
                });
                setShowModal(false);
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <div className="datosDelProducto">
                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminará del sistema la categoria.
                    </p>
                </Alert>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombre"
                                          placeholder="Escribe el nombre"
                                          defaultValue={nombre}
                                          disabled
                            />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Modificación</Form.Label>
                            <Form.Control type="text" name="nombre"
                                          placeholder="Escribe el nombre"
                                          defaultValue={moment(fechaToCurrentTimezone(fechaActualizacion)).format('DD/MM/YYYY hh:mm a')}
                                          disabled
                            />
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title="Eliminar categoría"
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={loading}
                            >
                                {!loading ? "Eliminar categoría" : <Spinner animation="border" />}
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

export default EliminaCategorias;
