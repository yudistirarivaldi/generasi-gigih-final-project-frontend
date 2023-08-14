import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { baseUrl } from "../../utils/service.js";

function Cards() {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${baseUrl}/api/thumbnail`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((apiData) => setData(apiData.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Row xs={1} md={4} className="g-4">
      {data.map((item) => (
        <Col key={item._id}>
          <Card>
            <Card.Img
              variant="top"
              src={item.thumbnail}
              style={{ height: "200px" }}
            />
            <Card.Body>
              <Link to={`/videos/${item._id}`}>
                <Button variant="primary">Go Somewhere</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Cards;
