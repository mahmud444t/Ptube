// fetching category api
let sorted = false;
let currentCategory = 1000;


const buttonApi = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await res.json();
    const buttons = data.data
    showButton(buttons,);
}

// showing buttons
const showButton = (buttons) => {
    const btnContainer = document.getElementById('btn-container');
    btnContainer.innerHTML = '';
    buttons.forEach(button => {

        const btn = document.createElement('button');
        btn.textContent = button.category;
        btn.classList.add('buttons-category', 'btn', 'btn-ghost', 'text-white', 'text-lg', 'bg-slate-700');

        // If it's the "All" button, mark it as red initially
        if (button.category_id === '1000') {
            btn.classList.remove('bg-slate-700');

            btn.classList.add('bg-red-600');

        }

        btn.addEventListener('click', () => {

            const buttons = document.querySelectorAll('.buttons-category');
            for (const button of buttons) {
                button.classList.remove('bg-red-600');
                button.classList.add('bg-slate-700');
            }
            btn.classList.remove('bg-slate-700');
            btn.classList.add('bg-red-600');
            currentCategory = button.category_id;
            videoApi(button.category_id);
        });

        btnContainer.appendChild(btn);
    });
    videoApi(currentCategory);

}





// videos api

const videoApi = async (category_id, sort = false) => {

    // fetching
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${category_id}`);
    const data = await res.json();
    const videosData = data.data;
    //fethcing finished



    if (sort) {

        videosData.sort((a, b) => {
            const viewsA = parseFloat(a.others?.views.replace("k", '')) || 0;
            const viewsB = parseFloat(b.others?.views.replace("k", '')) || 0;
            return viewsB - viewsA;
        });
    }

    showCategoryVideos(videosData);

};


const showCategoryVideos = (videosData) => {
    if (videosData.length === 0) {
        document.getElementById('error-element').classList.remove('hidden');
    } else {
        document.getElementById('error-element').classList.add('hidden');
    }

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    videosData.forEach(videoData => {
        if (videoData.others && videoData.others.posted_date && videoData.others.posted_date.trim() !== '') {
            const totalMinutes = parseInt(videoData.others.posted_date);
            const days = Math.floor(totalMinutes / (60 * 24));
            const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
            const durationString = `${days} days ${hours} hours`;

            const video = document.createElement('div');

            let verified = '';
            if (videoData.authors[0].verified) {
                verified = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>`;
            }

            // adding videos
            video.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full" src="${videoData.thumbnail}" alt="Shoes" />
                    <h6 class="absolute bottom-[40%] text-white right-12">${durationString}</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src="${videoData.authors[0].profile_picture}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${videoData.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${videoData.authors[0].profile_name}</p>
                                ${verified}
                            </div>
                            <p class="mt-3">${videoData.others?.views}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;

            cardContainer.appendChild(video);
        } else {
            const video = document.createElement('div');
            video.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full" src="${videoData.thumbnail}" alt="Shoes" />
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src="${videoData.authors[0].profile_picture}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${videoData.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${videoData.authors[0].profile_name}</p>
                            </div>
                            <p class="mt-3">${videoData.others?.views}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            cardContainer.appendChild(video);
        }
    });
};

// Add event listener to the "Sort btn" button

const sortByViewsButton = document.getElementById('sort-btn');
sortByViewsButton.addEventListener('click', () => {
    sorted = true;
    videoApi(currentCategory, sorted)
});


buttonApi();

