import { Backdrop, Fade, Grid, Modal, Paper, Table } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { authGet } from "../../api";
import TableRowProductInfo from "./TableRowProductInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    margin: "24px 0 12px",
  },
  paper: {
    padding: theme.spacing(2),
  },
  // gridContainer: {
  //   margin: "18px 0px",
  // },
  table: {
    // minWidth: "50%",
    // maxWidth: "80%",
  },
  buttonWrapper: {
    width: "100%",
    textAlign: "right",
  },
  button: {
    marginTop: "6px",
    marginBottom: "36px",
  },
  wrapper: {
    backgroundColor: "#ebebeb",
    padding: "16px 24px",
  },
  productImagesWrapper: {
    marginRight: "36px",
  },
  image: {
    cursor: "pointer",
    objectFit: "cover",
  },
  productPriceWrapper: {
    margin: "24px 0px",
    backgroundColor: "#f1f1f1",
    padding: "20px 16px",
    color: "red",
  },
  productPrice: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  productCountContainer: {
    display: "flex",
    fontSize: "24px",
    alignItems: "center",
  },
  productCountDiv: {
    display: "flex",
    alignItems: "center",
  },
  productAmountTitle: {
    textTransform: "capitalize",
    marginRight: "16px",
  },
  productCountWrapper: {
    display: "flex",
    columnGap: "8px",
    marginRight: "32px",
    alignItems: "center",
    border: "1px solid #ebebeb",
  },
  countButton: {
    padding: "12px 24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  productCount: {
    padding: "12px 24px",
  },
  productAmount: {
    flex: 1,
  },
  buyButton: {
    marginTop: "20px",
    textAlign: "center",
    backgroundColor: "#ff6d1e",
    color: "white",
    outline: "none",
    padding: "20px 36px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
    transition: "opacity 0.25s ease-in",
    "&:hover": {
      opacity: 0.8,
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "1024px",
  },
}));

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  autoPlay: false,
  pauseOnHover: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <CustomArrow />,
  prevArrow: <CustomArrow />,
};

const settingsModal = {
  dots: false,
  infinite: true,
  speed: 500,
  autoPlay: false,
  pauseOnHover: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <CustomArrow />,
  prevArrow: <CustomArrow />,
};

function CustomArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", backgroundColor: "#ff6d1e" }}
      onClick={onClick}
    />
  );
}

function ProductDetailUserView(props) {
  const history = useHistory();
  const { productId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const classes = useStyles();
  const [img, setImg] = useState("");
  const [shouldForceUpdate, setShouldForceUpdate] = useState(false);

  const [priceList, setPriceList] = useState([]);
  const [info, setInfo] = useState({
    weight: 0,
    description: "",
  });
  const [open, setOpen] = React.useState(false);
  const [allImagesToRender, setAllImagesToRender] = useState([]);
  const { weight, description } = info;

  useEffect(() => {
    authGet(dispatch, token, "/product/" + productId).then(
      (res) => {
        setData(res);
        setInfo((prev) => ({
          ...prev,
          weight: res.weight,
          description: res.description,
        }));
        setImg(`data:image/jpeg;base64,${res.avatar}`);
      },
      (error) => {
        setData({});
      }
    );
    authGet(dispatch, token, "/get-product-price-history/" + productId).then(
      (r) => setPriceList(r)
    );
  }, [shouldForceUpdate]);

  const handleOpen = (imgSrc) => {
    const allImages = [data.avatar, ...data.attachmentImages];
    const newAllImages = allImages.filter((src) => src !== imgSrc);
    newAllImages.unshift(imgSrc);

    setAllImagesToRender(newAllImages);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.wrapper}>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.gridContainer}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <div className={classes.productImagesWrapper}>
                <div>
                  {data.avatar ? (
                    <img
                      src={img}
                      width="90%"
                      height={450}
                      alt="product"
                      className={classes.image}
                      onClick={() => handleOpen(data.avatar)}
                    />
                  ) : (
                    <Typography variant="h6" component="h6">
                      Sản phẩm chưa có ảnh hiển thị
                    </Typography>
                  )}
                </div>

                {data.attachmentImages && data.attachmentImages.length > 0 ? (
                  <Slider {...settings}>
                    {[data.avatar, ...data.attachmentImages].map((i, index) => (
                      <div key={index}>
                        <img
                          src={`data:image/jpeg;base64,${i}`}
                          width={80}
                          height={80}
                          alt="product"
                          className={classes.image}
                          onMouseOver={() =>
                            setImg(`data:image/jpeg;base64,${i}`)
                          }
                          onClick={() => handleOpen(i)}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <Typography variant="body1" component="h6">
                    Thể loại: {data.type}
                  </Typography>
                )}
              </div>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" align="left">
                {data.productName}
              </Typography>
              <Typography variant="h6" component="h6" align="left">
                {data?.description}
              </Typography>
              <div className={classes.productPriceWrapper}>
                <span className={classes.productPrice}>80.000đ</span>
              </div>
              <div className={classes.productCountContainer}>
                <div className={classes.productCountDiv}>
                  <span className={classes.productAmountTitle}>Số lượng</span>
                  <div className={classes.productCountWrapper}>
                    <span className={classes.countButton}>-</span>
                    <span className={classes.productCount}>1</span>
                    <span className={classes.countButton}>+</span>
                  </div>
                </div>
                <div className={classes.productAmount}>
                  Số lượng còn lại: {data.weight}
                </div>
              </div>
              <button type="button" className={classes.buyButton}>
                Mua
              </button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Typography
          variant="h5"
          component="h3"
          align="left"
          className={classes.title}
        >
          Chi tiết sản phẩm mã {data.productId}
        </Typography>
        <Grid item xs={12} className={classes.gridContainer}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRowProductInfo
                      keyInfo="productName"
                      data={data === null ? "" : data["productName"]}
                      label="Tên"
                    />
                    <TableRowProductInfo
                      keyInfo="productType"
                      data={data === null ? "" : data["type"]}
                      label="Thể loại"
                    />
                    <TableRowProductInfo
                      keyInfo="amount"
                      data={info.weight}
                      label="Số lượng"
                    />
                    <TableRowProductInfo
                      keyInfo="uom"
                      data={data.uom === null ? "" : data["uom"]}
                      label="Đơn vị"
                    />
                    <TableRowProductInfo
                      keyInfo="description"
                      data={
                        info.description === "" ? "Chưa có" : info.description
                      }
                      label="Miêu tả"
                    />
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paperModal}>
            <Slider {...settingsModal}>
              {allImagesToRender.map((i, index) => (
                <div key={index + 100}>
                  <img
                    id="transition-modal-description"
                    src={`data:image/jpeg;base64,${i}`}
                    width="100%"
                    height={800}
                    alt="product"
                    className={classes.image}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default ProductDetailUserView;
