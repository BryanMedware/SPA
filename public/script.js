const scrollTopButton = document.getElementById('scrollTopButton');
scrollTopButton.style.display = 'none';

window.onscroll = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopButton.style.display = 'flex';
  } else {
    scrollTopButton.style.display = 'none';
  }  
};

scrollTopButton.addEventListener('click', () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});