import { useState } from 'react';
import "./CancelarVenta.scss"
import {cancelarVenta} from "../../../api/ventas";
import {toast} from "react-toastify";
import {Button, Col, Row, Form, Spinner, Alert} from "react-bootstrap";
import queryString from "query-string";
import moment from "moment";
import "moment/locale/es";

const fechaToCurrentTimezone = (fecha) => {
  const date = new Date(fecha)

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())


  return date.toISOString().slice(0, 16);
}

function CancelarVenta(props) {
    const { idVenta, noTiquet, estado, productosVendidos, totalVenta, fechaCreacion, history, setShowModal } = props;
    
    moment.locale("es");
    
    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }
    
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
      e.preventDefault()
        setLoading(true);
        try {
            const dataTemp = {
                estado: estado === "true" ? "false": "true"
            }
          cancelarVenta(idVenta, dataTemp).then(response => {
              const { data } = response;
              setLoading(false)
              toast.success(data.mensaje)
              history.push({
                  search: queryString.stringify(""),
              });
              setShowModal(false)
          }).catch(e => {
              console.log(e)
          })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
                <div className="datosDelProducto">
                
                {estado === "true" ?
                (
                <>
                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción cancelara la venta.
                    </p>
                </Alert>
                </>
                )
                :
                (
                <>
                  <Alert variant="success">
                                <Alert.Heading>Atención! Acción constructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción recuperara la venta.
                     </p>
                </Alert>
                </>
                )
                }
                <Form onSubmit={onSubmit}>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNoTiquet">
                        Número del ticket
                        <Form.Control type="text" name="noTiquet"
                                      defaultValue={noTiquet}
                                      disabled
                        />
                    </Form.Group>
                    
                    <Form.Group as={Col} controlId="formGridNoProductos">
                        Productos vendidos
                        <Form.Control type="text" name="noTiquet"
                                      defaultValue={productosVendidos}
                                      disabled
                        />
                    </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNoTiquet">
                        Total
                        <Form.Control type="text" name="noTiquet"
                                      defaultValue={totalVenta}
                                      disabled
                        />
                    </Form.Group>
                    
                    <Form.Group as={Col} controlId="formGridNoProductos">
                        Día de la venta
                        <Form.Control type="text" name="noTiquet"
                                      defaultValue={moment(fechaToCurrentTimezone(fechaCreacion)).format('DD/MM/YYYY hh:mm a')}
                                      disabled
                        />
                    </Form.Group>
                    </Row>
                
                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title={estado === "true" ? "cancelar venta" : "recuperar venta"}
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? (estado === "true" ? "Cancelar venta": "Recuperar venta") : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                title="Cerrar ventana" 
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarRegistro()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                
            </Form>
            </div>
        </>
    );
}

export default CancelarVenta;
