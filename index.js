const filter = document.querySelectorAll(".category-card");
const items = document.querySelectorAll(".photo-card");
const feedbackText = document.getElementById("feedback-text");
const feedbackIcon = document.getElementById("feedback-icon");
const lightBoxWrapper = document.querySelector(".gallery-lightbox-wrapper");
const lightBoxCentre = document.querySelector(".gallery-lightbox");
const closeButton = document.getElementById("lightbox-close-btn");
const commentSection = document.getElementById("lightbox-comments-section");
const commentButton = document.getElementById("comment-icon");
const COMMENTS_WIDTH = 350;   // matches your CSS
const MIN_IMAGE_WIDTH = 520; // comfortable image size
const heartIcon = document.querySelector(".heart-icon-svg");
const imageCaption = document.querySelector(".lightbox-caption");

let likeCounts = []; 

const data = localStorage.getItem("_likeCount_");
if (data){
    likeCounts = JSON.parse(data);
}


filter.forEach(button => {
    button.addEventListener("click", ()=>{
        const selectedCategory = button.getAttribute("data-category");


        filterImages(selectedCategory);
    });
});

function filterImages(category){

    let counter = 0;
    items.forEach(item =>{
        const itemCategory = item.getAttribute("data-category");

        const categoriesArray = itemCategory.split(" ");


        if (category === "all"||categoriesArray.includes(category)){
            item.classList.remove("hidden");
            counter++;
        }
        else {
            item.classList.add("hidden");
        }
    });

    if (counter === 0){
        feedbackText.textContent = "NO RESULTS FOUND...";

        feedbackIcon.src = "icons/icons-sad-face.png";


        feedbackIcon.style.display = "block";
        feedbackText.classList.remove("hidden");
    }

    else {
        
        if (feedbackIcon) {
            feedbackIcon.src = "";
            feedbackIcon.style.display = "none";
        }

        feedbackText.textContent = "";
        feedbackText.classList.add("hidden");
    }

    
};

items.forEach(clicked =>{
    clicked.addEventListener("click", ()=>{
        focusCentre(clicked);
    })
});

function focusCentre(clicked){
    const lightBoxImage = lightBoxCentre.querySelector("img");
    const imageId = clicked.dataset.id;    

    lightBoxImage.src = clicked.src;
    imageCaption.textContent = clicked.dataset.caption || "";

    heartIcon.classList.toggle("liked", likeCounts.includes(imageId));

    heartIcon.onclick = () => {

        if (likeCounts.includes(imageId)) {
            // Unlike
            likeCounts = likeCounts.filter(id => id !== imageId);
            heartIcon.classList.remove("liked");
        } else {
            // Like
            likeCounts.push(imageId);
            heartIcon.classList.add("liked");
        }

        localStorage.setItem("_likeCount_", JSON.stringify(likeCounts));
    };

    lightBoxWrapper.classList.add("active");
    document.body.classList.add("no-scroll");

    requestAnimationFrame(updateLightboxLayout);
}

closeButton.addEventListener("click", ()=>{
    lightBoxWrapper.classList.remove("active");
    document.body.classList.remove("no-scroll");
    commentSection.classList.remove("active");
    lightBoxCentre.classList.remove("gallery-lightbox-active");
    lightBoxCentre.classList.remove("stacked-layout");
});

commentButton.addEventListener("click", ()=>{
    commentSection.classList.toggle("active");
    lightBoxCentre.classList.toggle("gallery-lightbox-active");

    requestAnimationFrame(updateLightboxLayout);
});

function updateLightboxLayout() {
    // Only care when comments are open
    if (!commentSection.classList.contains("active")) {
        lightBoxCentre.classList.remove("stacked-layout");
        lightBoxWrapper.classList.remove("stacked-layout");
        return;
    }

    const totalAvailableWidth = lightBoxWrapper.clientWidth;

    const threshold = MIN_IMAGE_WIDTH + COMMENTS_WIDTH + 40;

    if (totalAvailableWidth < threshold) {
        lightBoxCentre.classList.add("stacked-layout");
        lightBoxWrapper.classList.add("stacked-layout");
    } else {
        lightBoxCentre.classList.remove("stacked-layout");
        lightBoxWrapper.classList.remove("stacked-layout");
    }

    lightBoxWrapper.classList.toggle(
        "stacked-layout",
        lightBoxCentre.classList.contains("stacked-layout")
    );
}

window.addEventListener("resize", updateLightboxLayout);

window.addEventListener("keydown", (event)=>{

    if(lightBoxCentre.classList.contains("gallery-lightbox-active") && event.key === "Escape")
    {
        lightBoxWrapper.classList.remove("active");
        document.body.classList.remove("no-scroll");
        commentSection.classList.remove("active");
        lightBoxCentre.classList.remove("gallery-lightbox-active");
        lightBoxCentre.classList.remove("stacked-layout");
    }

});


