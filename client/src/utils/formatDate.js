const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const day = date.getDate(); // Ngày
    const month = date.getMonth() + 1; // Tháng (0-11, nên cộng thêm 1)
    const year = date.getFullYear(); // Năm

    // Định dạng ngày tháng theo dạng dd/MM/yyyy
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;
};

export default formatDate;