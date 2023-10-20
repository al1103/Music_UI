const clientId = "13c581b4cb242a582af2b12576947ea";
const clientSecret = "fe29316d261b7423986758009aeb7d4cb";

const auth = btoa(clientId + ':' + clientSecret);
const requestOptions = {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
};

fetch('https://accounts.spotify.com/api/token', requestOptions)
    .then(response => response.json())
    .then(data => {
        const access_token = data.access_token;

        fetch('https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
        })
        .then(response => response.json())
        .then(data => {
            // Xử lý dữ liệu từ playlist ở đây
            console.log(data);
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu đến Spotify API:', error);
        });
    })
    .catch(error => {
        console.error('Lỗi xác thực Spotify:', error);
    });


// thanh cuộn 
// Lấy phần tử "Your Library" và các phần tử con
const yourLibraryLink = document.getElementById("your-library-link");
const controlSection = document.querySelector(".control-section");

// Lắng nghe sự kiện click trên "Your Library"
yourLibraryLink.addEventListener("click", function() {
  // Kiểm tra xem controlSection có lớp "hidden" không
  if (controlSection.classList.contains("hidden")) {
    // Nếu có, loại bỏ lớp "hidden" để hiển thị các mục
    controlSection.classList.remove("hidden");
  } else {
    // Nếu không, thêm lớp "hidden" để ẩn các mục
    controlSection.classList.add("hidden");
  }
});