import { staticImages } from "../utils/images";

const navMenuData = [
    {
        id: "nav-menu-1",
        menuLink: "/product",
        menuText: "Sản phẩm",
    },
    {
        id: "nav-menu-1",
        menuLink: "/product/vi-cam-tay",
        menuText: "Ví cầm tay",
    },
    {
        id: "nav-menu-1",
        menuLink: "/product/tui-sach",
        menuText: "Túi sách",
    },
    {
        id: "nav-menu-1",
        menuLink: "/product",
        menuText: "Bộ sưu tập",
    },
];

const sideMenuData = [
    {
        id: "side-menu-1",
        menuLink: "/",
        menuText: "Trang chủ",
        iconName: "house",
    },
    {
        id: "side-menu-2",
        menuLink: "/product",
        menuText: "Sản phẩm",
        iconName: "grid-fill",
    },

    {
        id: "side-menu-4",
        menuLink: "/account",
        menuText: "Tài khoản của tôi",
        iconName: "person-fill",
    },
    {
        id: "side-menu-5",
        menuLink: "/cart",
        menuText: "Giỏ hàng",
        iconName: "bag-check-fill",
    },
];

const bannerData = [
    {
        id: "banner-1",
        topText: "Tôn vinh phong cách",
        titleText: "Khẳng định đẳng cấp!",
        bottomText: "",
        buttonLink: "/product",
        buttonText: "Mua ngay",
        imgSource: staticImages.hero_img1,
    },
    {
        id: "banner-2",
        topText: "Túi xách thời thượng",
        titleText: "Nâng tầm mọi outfit!",
        bottomText: "",
        buttonLink: "/product",
        buttonText: "Mua ngay",
        imgSource: staticImages.hero_img2,
    },
    {
        id: "banner-3",
        topText: "Chất liệu cao cấp, bền đẹp vượt thời gian!",
        titleText: "Đỉnh cao thời trang, đồng hành mọi lúc mọi nơi!",
        bottomText: "",
        buttonLink: "/product",
        buttonText: "Mua ngay",
        imgSource: staticImages.hero_img3,
    },
    {
        id: "banner-4",
        topText: "Hàng trăm mẫu mới, chỉ chờ bạn khám phá!",
        titleText: "Thể hiện cá tính của bạn!",
        bottomText: "",
        buttonLink: "/product",
        buttonText: "Mua ngay",
        imgSource: staticImages.hero_img4,
    },
];

const featuredData = [
    {
        id: "featured-1",
        imgSource: staticImages.img1,
        topText: "Khuyến mãi",
        largeText: "Giảm giá lên đến 50%",
        bottomText: "",
        buttonLink: "/product",
        buttonText: "Khám phá sản phẩm ngay",
    },
    {
        id: "featured-2",
        imgSource: staticImages.img2,
        topText: "Khách hàng mới nhận nhiều ưu đãi",
        largeText: "Free ship toàn quốc",
        bottomText: "Giảm giá 30% mọi đơn hàng",
        buttonLink: "/product",
        buttonText: "Khám phá sản phẩm ngay",
    },
];

const newArrivalData = [
    {
        id: "new-arrival-1",
        imgSource: staticImages.product1,
        title: "Knitted Joggers",
    },
    {
        id: "new-arrival-2",
        imgSource: staticImages.product2,
        title: "Full Sleeve",
    },
    {
        id: "new-arrival-3",
        imgSource: staticImages.product3,
        title: "Active T-Shirts",
    },
    {
        id: "new-arrival-4",
        imgSource: staticImages.product4,
        title: "Urban Shirts",
    },
    {
        id: "new-arrival-5",
        imgSource: staticImages.product5,
        title: "Urban Shirts",
    },
    {
        id: "new-arrival-6",
        imgSource: staticImages.product6,
        title: "Urban Shirts",
    },
    {
        id: "new-arrival-7",
        imgSource: staticImages.product7,
        title: "Urban Shirts",
    },
];

const savingZoneData = [
  {
    id: "saving-z-1",
    imgSource: staticImages.home1,
    title: "Túi xách Hawaii",
    description: "Phù hợp với phong cách mùa hè",
    discount: 50,
    isLimited: false,
},
{
    id: "saving-z-2",
    imgSource: staticImages.home2,
    title: "Ví đính bạc da",
    description: "Thiết kế mới mỗi tuần",
    discount: 40,
    isLimited: true,
},
{
    id: "saving-z-3",
    imgSource: staticImages.home3,
    title: "Túi xách công sở",
    description: "Phong cách và sự tiện dụng",
    discount: 50,
    isLimited: false,
},
{
    id: "saving-z-4",
    imgSource: staticImages.home4,
    title: "Túi xách thời trang",
    description: "Sống trong phong cách và sự thoải mái",
    discount: 20,
    isLimited: false,
},
{
    id: "saving-z-5",
    imgSource: staticImages.home5,
    title: "Túi xách dáng rộng",
    description: "Phong cách đường phố đậm chất",
    discount: 60,
    isLimited: false,
},

];

const products = [
    {
        id: 1,
        imgSource: staticImages.product1,
        title: "Active wear",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 2,
        imgSource: staticImages.product2,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 3,
        imgSource: staticImages.product3,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 4,
        imgSource: staticImages.product4,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 5,
        imgSource: staticImages.product5,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 6,
        imgSource: staticImages.product6,
        title: "Printed T-Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 7,
        imgSource: staticImages.product7,
        title: "Plain T-Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 8,
        imgSource: staticImages.product8,
        title: "Polo T-Shirt",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 9,
        imgSource: staticImages.product9,
        title: "Hoddies & Sweatshirt",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 10,
        imgSource: staticImages.product10,
        title: "Jeans",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 11,
        imgSource: staticImages.product11,
        title: "Boxers",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 12,
        imgSource: staticImages.product12,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 13,
        imgSource: staticImages.product13,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 14,
        imgSource: staticImages.product14,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 15,
        imgSource: staticImages.product15,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 16,
        imgSource: staticImages.product16,
        title: "Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 17,
        imgSource: staticImages.product17,
        title: "Printed T-Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 18,
        imgSource: staticImages.product18,
        title: "Plain T-Shirts",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
    {
        id: 19,
        imgSource: staticImages.product19,
        title: "Polo T-Shirt",
        brand: "Jhanvi’s Brand",
        price: 123.0,
    },
];

const mensCatalog = [...products.slice(4, 11), products[1]];

const womensCatalog = products.slice(11, 15);

const limelightCatalog = products.slice(15, 19);

const brandsData = [
    {
        id: "brand-1",
        imgSource: staticImages.brand1,
    },
    {
        id: "brand-2",
        imgSource: staticImages.brand2,
    },
    {
        id: "brand-3",
        imgSource: staticImages.brand3,
    },
    {
        id: "brand-4",
        imgSource: staticImages.brand4,
    },
    {
        id: "brand-5",
        imgSource: staticImages.brand5,
    },
];

const feedbackData = [
    {
        id: "feedback-1",
        imgSource: staticImages.test1,
        name: "Floyd Miles",
        designation: "Marketing Manger",
        rating: 3,
        feedbackText:
            "I am incredibly pleased with my recent shopping experience on this clothing ecommerce website. The user-friendly interface made it a breeze to browse through a wide range of stylish options. The variety of sizes and styles available was impressive, and I found the perfect outfit for a special occasion. ",
    },
    {
        id: "feedback-2",
        imgSource: staticImages.test2,
        name: "Ronald Richards",
        designation: "Teacher",
        rating: 4,
        feedbackText:
            "This clothing ecommerce website has become my go-to destination for fashion finds. The selection is fantastic, catering to various tastes and preferences. From casual wear to elegant pieces, I always discover something unique and stylish. The website's organization and clear product images make it easy to make informed choices. ",
    },
    {
        id: "feedback-3",
        imgSource: staticImages.test3,
        name: "Savannah Nguyen",
        designation: "Student",
        rating: 4,
        feedbackText:
            "I want to express my gratitude for the exceptional service provided by this clothing ecommerce website. Not only is the website intuitive and easy to navigate, but the customer service team also went above and beyond to assist me with a query. ",
    },
    {
        id: "feedback-4",
        imgSource: staticImages.test4,
        name: "Arthur Ramsay",
        designation: "Fashion Designer",
        rating: 4,
        feedbackText:
            "I recently made a purchase from this clothing ecommerce website, and I couldn't be happier with my experience. The website is well-designed, making it easy to navigate and find the items I was looking for. The product descriptions were detailed, helping me make informed decisions.",
    },
];

const footerData = [
    {
        id: "f_need_help",
        title: "Need Help",
        links: [
            { text: "Liên hệ chúng tôi", url: "/contact" },
            { text: "FAQ's", url: "/faqs" },
            { text: "Sự nghiệp", url: "/career" },
        ],
    },
    {
        id: "f_company",
        title: "Công ty",
        links: [
            { text: "Về chúng tôi", url: "/contact" },
            { text: "Dan Dan blog", url: "/blog" },
            { text: "Cộng tác viên", url: "/collaboration" },
            { text: "Media", url: "/media" },
        ],
    },
    {
        id: "f_more_info",
        title: "Thông tin thêm",
        links: [
            { text: "Điều khoản và điều kiện", url: "/tac" },
            { text: "Chính sách bảo mật", url: "/privacy" },
            { text: "Chính sách vận chuyển", url: "/shipping" },
        ],
    },
    {
        id: "f_location",
        title: "Location",
        lists: [
          { text: "Tsupport@euphoria.in" },
          { text: "số 299 nguyễn cao, suối hoa, Bắc Ninh" },
          { text: "Thành phố Bắc Ninh, Việt Nam" },
          { text: "Số điện thoại: +000 999 8888" },
        ],
    },
];

const cartItems = [
    {
        id: "C001",
        title: "Blue Flower Print Crop Top",
        color: "Yellow",
        size: "M",
        price: 29.0,
        quantity: 2,
        shipping: 0.0,
        imgSource: staticImages.cart1,
    },
    {
        id: "C002",
        title: "Blue Flower Print Crop Top",
        color: "Blue",
        size: "XL",
        price: 199.0,
        quantity: 5,
        shipping: 0.0,
        imgSource: staticImages.cart2,
    },
    {
        id: "C003",
        title: "Blue Flower Print Crop Top",
        color: "Yellow",
        size: "M",
        price: 123.0,
        quantity: 1,
        shipping: 5.0,
        imgSource: staticImages.cart3,
    },
];

const ProductFilterList = [
    {
        id: "prod_filter_1",
        title: "Tops",
    },
    {
        id: "prod_filter_2",
        title: "Printed T-shirts",
    },
    {
        id: "prod_filter_3",
        title: "Plain T-shirts",
    },
    {
        id: "prod_filter_4",
        title: "Kurti",
    },
    {
        id: "prod_filter_5",
        title: "Boxers",
    },
    {
        id: "prod_filter_6",
        title: "Full sleeve T-shirts",
    },
    {
        id: "prod_filter_7",
        title: "Joggers",
    },
    {
        id: "prod_filter_8",
        title: "Payjamas",
    },
    {
        id: "prod_filter_9",
        title: "Jeans",
    },
];

const StyleFilterList = [
    {
        id: "style_filter_1",
        title: "Classic",
    },
    {
        id: "style_filter_2",
        title: "Casual",
    },
    {
        id: "style_filter_3",
        title: "Business",
    },
    {
        id: "style_filter_4",
        title: "Sport",
    },
    {
        id: "style_filter_5",
        title: "Elegant",
    },
    {
        id: "style_filter_6",
        title: "Formal (evening)",
    },
];

const pricingData = [
    {
        id: "pricing_1",
        name: "Pick Any 4- Womens Plain T-shirt Combo",
        price: 19,
    },
    {
        id: "pricing_2",
        name: "Pick Any 4- Plain Womens Boxer Combo",
        price: 18,
    },
    {
        id: "pricing_3",
        name: "Multicolor Checkered Long Casual Shirts for Women",
        price: 16.7,
    },
    {
        id: "pricing_4",
        name: "Pick Any 4 - Women Plain Full Sleeve T-shirt Combo",
        price: 12,
    },
    {
        id: "pricing_5",
        name: "Pick Any 2: Plain Boxy Casual Shirts for Women Combo",
        price: 9.8,
    },
    {
        id: "pricing_6",
        name: "Jade Black Narrow Cut Flexible Women Jeggings",
        price: 15,
    },
    {
        id: "pricing_7",
        name: "Mustard-yellow Solid Straight-Fit Women Pant",
        price: 6.7,
    },
    {
        id: "pricing_8",
        name: "Pista Green Solid Boxy Casual Shirts for Women",
        price: 9,
    },
];

const servicesData = [
    {
        id: "service_1",
        icon: staticImages.card_icon,
        text: "Secure Payment",
    },
    {
        id: "service_2",
        icon: staticImages.size_icon,
        text: "Size & fit",
    },
    {
        id: "service_3",
        icon: staticImages.shipping_icon,
        text: "Free Shipping",
    },
    {
        id: "service_4",
        icon: staticImages.return_icon,
        text: "Free Shipping & Returns",
    },
];

const product_one = {
    id: "product_01",
    title: "Raven Hoodie With Black Colored Design",
    previewImages: [
        {
            id: "preview1",
            imgSource: staticImages.preview1,
        },
        {
            id: "preview2",
            imgSource: staticImages.preview2,
        },
        {
            id: "preview3",
            imgSource: staticImages.preview3,
        },
        {
            id: "preview4",
            imgSource: staticImages.preview1,
        },
        {
            id: "preview5",
            imgSource: staticImages.preview2,
        },
    ],
    rating: 3.5,
    comments_count: 120,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["#3C4242", "#EDD146", "#EB84B0", "#9C1F35"],
    price: 63.0,
};

const productDescriptionTabHeads = [
    {
        id: "tab-description",
        tabHead: "tabDescription",
        tabText: "Mô tả về sản phẩm",
        badgeValue: null,
        badgeColor: "",
    },
    {
        id: "tab-comments",
        tabHead: "tabComments",
        tabText: "Các bình luận",
        badgeValue: 10,
        badgeColor: "purple",
    },
];

const orderData = [
    {
        id: "order_1",
        order_no: "#5558760098",
        order_date: "2 June 2023 2:40 PM",
        status: "Delivered",
        delivery_date: "8 June 2023",
        payment_method: "Cash on Delivery",
        items: [
            {
                id: "product_01",
                name: "Printed white coat",
                color: "White",
                quantity: 1,
                price: 23,
                imgSource: staticImages.cart1,
            },
            {
                id: "product_02",
                name: "Stretchy jumper for women",
                color: "Maroon",
                quantity: 5,
                price: 21,
                imgSource: staticImages.cart2,
            },
            {
                id: "product_03",
                name: "Black Color Hoodie",
                color: "Black",
                quantity: 10,
                price: 90,
                imgSource: staticImages.cart3,
            },
        ],
    },
    {
        id: "order_2",
        order_no: "#8958360118",
        order_date: "2 June 2023 2:40 PM",
        status: "inprogress",
        delivery_date: "12 August 2023",
        payment_method: "Online Payment",
        items: [
            {
                id: "product_04",
                name: "Stretchy jumper for women",
                color: "Maroon",
                quantity: 5,
                price: 21,
                imgSource: staticImages.cart2,
            },
            {
                id: "product_05",
                name: "Printed white coat",
                color: "White",
                quantity: 1,
                price: 23,
                imgSource: staticImages.cart1,
            },
            {
                id: "product_08",
                name: "Black Color Hoodie",
                color: "Black",
                quantity: 10,
                price: 90,
                imgSource: staticImages.cart3,
            },
        ],
    },
];

const wishlistData = [
    {
        id: "wishlist_1",
        name: "Blue Flower Print Crop Top",
        color: "yellow",
        quantity: 1,
        price: 29,
        imgSource: staticImages.wishitem1,
    },
    {
        id: "wishlist_2",
        name: "Yellow Flower Print Dress",
        color: "yellow",
        quantity: 4,
        price: 40,
        imgSource: staticImages.wishitem2,
    },
    {
        id: "wishlist_3",
        name: "White Hoodie long sleeve",
        color: "white",
        quantity: 1,
        price: 123,
        imgSource: staticImages.wishitem3,
    },
    {
        id: "wishlist_4",
        name: "Brown men’s long sleeve T-shirt",
        color: "brown",
        quantity: 6,
        price: 42,
        imgSource: staticImages.wishitem4,
    },
];

const recentViewedData = products.slice(0, 4);

const cardsData = [
    {
        id: "card_1",
        imgSource: staticImages.paypal,
    },
    {
        id: "card_2",
        imgSource: staticImages.paypass,
    },
    {
        id: "card_3",
        imgSource: staticImages.googlePay,
    },
    {
        id: "card_4",
        imgSource: staticImages.visa,
    },
];

const socialLinksData = [
    {
        id: "social_link_1",
        site_name: "facebook",
        site_icon: "bi bi-facebook",
        site_url: "https://www.facebook.com/",
    },
    {
        id: "social_link_2",
        site_name: "instagram",
        site_icon: "bi bi-instagram",
        site_url: "https://www.instagram.com/",
    },
    {
        id: "social_link_3",
        site_name: "twitter",
        site_icon: "bi bi-twitter",
        site_url: "https://x.com/",
    },
    {
        id: "social_link_4",
        site_name: "linkedin",
        site_icon: "bi bi-linkedin",
        site_url: "https://www.linkedin.com/",
    },
];

export {
    products,
    cartItems,
    sideMenuData,
    navMenuData,
    bannerData,
    featuredData,
    savingZoneData,
    mensCatalog,
    womensCatalog,
    limelightCatalog,
    brandsData,
    newArrivalData,
    feedbackData,
    footerData,
    ProductFilterList,
    StyleFilterList,
    pricingData,
    servicesData,
    product_one,
    productDescriptionTabHeads,
    orderData,
    wishlistData,
    recentViewedData,
    cardsData,
    socialLinksData,
};
