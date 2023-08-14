import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { useRef } from "react";
import { baseUrl } from "../../utils/service.js";

function CardDetail() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${baseUrl}/api/thumbnail/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((apiData) => {
          setComments(apiData.comments);
          setVideoData(apiData.data);
          setProducts(apiData.products);
        })
        .catch((error) => console.error("Error fetching data:", error));
    };

    const interval = setInterval(fetchData, 5000); // Setel interval polling (misalnya setiap 5 detik)

    fetchData(); // Panggil pertama kali saat komponen dimount

    return () => {
      clearInterval(interval); // Bersihkan interval saat komponen di-unmount
    };
  }, [id]);

  const limit = 10;

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  }

  const commentListRef = useRef(null); // Ref untuk daftar komentar

  useEffect(() => {
    const scrollToBottom = () => {
      if (commentListRef.current) {
        commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [comments]);

  const submitComment = () => {
    if (newComment) {
      fetch(`${baseUrl}/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          videoId: id,
          comment: newComment,
          username: user.username,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            // Jika komentar berhasil diposting, tambahkan komentar baru ke state comments
            setComments([...comments, data.data]);
            setNewComment(""); // Reset nilai komentar baru
          }
        })
        .catch((error) => console.error("Error posting comment:", error));
    }
  };

  return (
    <div>
      <Row>
        <Col>
          {products.slice(0, limit).map((product) => (
            <>
              <Card style={{ width: "18rem" }} key={product._id}>
                <Card.Img
                  variant="top"
                  src={product.linkImage}
                  style={{ height: "200px" }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>{formatRupiah(product.price)}</Card.Text>
                  <Link to={product.linkProduct}>
                    <Button variant="primary">Go somewhere</Button>
                  </Link>
                </Card.Body>
              </Card>
              <br />
            </>
          ))}
        </Col>
        <Col>
          {videoData && (
            <iframe
              width="500"
              height="500"
              src={videoData.videoUrl}
              allow="autoplay"
            ></iframe>
          )}
        </Col>
        <Col>
          <Stack gap={4} className="chat-box" ref={commentListRef}>
            <div className="chat-header">
              <strong>Comment</strong>
            </div>

            {comments.map((comment) => (
              <Stack
                className="message align-self-start flex-grow-4"
                key={comment._id}
              >
                <span>{comment.username}</span>
                <span>{comment.comment}</span>
                <span className="message-footer">
                  {moment(comment.createdAt).format("yyyy-MM-DD HH:mm")}
                </span>
              </Stack>
            ))}

            <Stack
              direction="horizontal"
              gap={3}
              className="chat-input flex-grow-0"
            >
              <InputEmoji
                value={newComment}
                onChange={setNewComment}
                placeHolder="type a message"
                onEnter={submitComment}
              />
            </Stack>
          </Stack>
        </Col>
      </Row>
    </div>
  );
}

export default CardDetail;
