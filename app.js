
const page = document.getElementById('page');
const content = document.querySelector('.content');
const headerBtns = document.querySelector('.header_btns');
let store = window.localStorage;


const generateCard = (cat) => {
    return `<div class='cat_card'>
    <div class="cat_card_image">
    <img src=${cat.image !== '' ? cat.image : "images/default.gif"} alt="default" />
    </div>
    <p class="cat_name">${cat.name}</p>
    <p class="cat_description">${cat.description}</p>
    <div class="${cat.favorite ? 'cat_favorite activity' : 'cat_favorite'}">
    <img src="images/heart.gif" alt="Like"/>
    </div>
    <div class="cat_rate"></div>
    <div class="cat_card_btns">
    <button class="cat_card_view" value=${cat.id}>Посмотреть</button>
    <button class="cat_card_update" value=${cat.id}>Изменить</button>
    <button class="cat_card_delete" value=${cat.id}>Удалить</button>
    </div>
    </div>`;
    };



    const createCard = () => {
        return `<div class="create_edit_modal_form">
                    <h2 class="create_edit_modal_title">Добавить кота</h2>
                    <form action="/target/" class="modal_form">
                        <label for="name">Имя</label>  <br />
                        <input id="name" name="name" placeholder="Имя" required /> <br />
                        <label for="image">Изображение</label> <br />
                        <input id="image" name="image" placeholder="Вставьте изображение"/><br />
                        <label for="age">Возраст</label>  <br />
                        <input id="age" name="age" type="number" placeholder="Возраст" /> <br />
                        <label for="rate">Сила</label>  <br />
                        <input id="rate" name="rate" type="number" placeholder="Сила" > <br />
                        <label for="favorite">❤</label>
                        <input type="checkbox" id="favorite" name="favorite"/><br />
                        <label>Описание</label> <br />
                        <textarea id="description" name="description" rows="3" placeholder="Описание"></textarea><br/>
                        <button type="submit" class="button_form_submit"></button>
                        <button type="reset" class="button_form_close"></button>
                    </form>
                </div>`;
    };


    const generateCardView = (cat) => {
        return `<div class='cardView_popup'>
        <div class="cardView">
        <div class="cardView_image" style ="background-image: url('${cat.image || 'images/default.gif'}')">
        </div>
        <div class="cardView_content">
            <div class="card_name">${cat.name}</div>
            <div class="card_age"><span class="age">Возраст:<span>${cat.age}</div>
            <div class="card_rate">Сила: ${cat.rate}</div>
            <div class="card_description">${cat.description}</div>
            <button class="cardView_exit"></button>
        </div>
        </div>
    </div>`;
        };


const refreshCats = () => {
content.innerHTML = '';
api.getAllCats().then((res) => {
    console.log(res);
store.setItem('cats', JSON.stringify(res));
    const cards = JSON.parse(store.getItem('cats')).reduce(
    (acc, el) => (acc += generateCard(el)),'');
    content.insertAdjacentHTML('afterbegin', cards);
});
};

refreshCats();

headerBtns.addEventListener('click', (event) => {
if (event.target.tagName === 'BUTTON') {
    switch (event.target.className) {
    case 'add':
        const evt = event.target.value;
        const createCardForm = createCard();
        content.insertAdjacentHTML('afterbegin', createCardForm);
        const modal = document.querySelector('.create_edit_modal_form');
        modal.classList.add('active');
        const modalForm = document.querySelector('form');
        const modalBtnOk = modalForm.querySelector('.button_form_submit');
        const modalBtnClose = modalForm.querySelector('.button_form_close');
        modalBtnOk.addEventListener('click', (evt) => {
        const forms = document.forms[0];
        event.preventDefault();
        const formData = new FormData(forms);
        const catObj = Object.fromEntries(formData);
        const cat = { id: getNewIdOfCat(), ...catObj };
        console.log(cat);
        const favorite = cat.favorite
            ? (cat.favorite = true)
            : (cat.favorite = false);
        api.addCat({
            ...catObj,
            favorite: favorite,
            id: getNewIdOfCat(),
            }).then((res) => {
            console.log(res);
            refreshCats();
            });
        modal.classList.toggle('active');
        forms.reset();
        modal.remove();
        });
        modalBtnClose.addEventListener('click',(evt) => {
            modal.remove();
        },
        { once: true }
        );
        break;
        case 'update':
        refreshCats();
        break;
        }
        }
});

content.addEventListener('click', (event) => {
if (event.target.tagName === 'BUTTON') {
    switch (event.target.className) {
    case 'cat_card_view':
        console.log(event.target.value);
        let catView = getViewCardInLocal(event.target.value);
        console.log(catView);
        const cardViewPopup = generateCardView(catView);
        content.insertAdjacentHTML('afterbegin', cardViewPopup);
        const modalView = document.querySelector('.cardView_popup');

        const modalViewBtn = modalView.querySelector('button');
        modalViewBtn.addEventListener('click',(evt) => {
            modalView.remove();
        },
        { once: true }
        );
        break;
        case 'cat_card_update':
        const createCardForm = createCard();
        content.insertAdjacentHTML('afterbegin', createCardForm);
        const modal = document.querySelector('.create_edit_modal_form');
        const popupTitle = document.querySelector('.create_edit_modal_title');
        popupTitle.textContent = 'Изменить';
        modal.classList.toggle('active');
        const modalForm = document.querySelector('form');
        const modalBtn = modalForm.querySelector('button');
        const modalBtnClose = modalForm.querySelector('.button_form_close');
        const catUpdate = getViewCardInLocal(event.target.value);
        const forms = document.forms[0];
        const formElements = document.forms[0].elements;
        formElements.name.value = catUpdate.name;
        formElements.image.value = catUpdate.image;
        formElements.age.value = catUpdate.age;
        formElements.rate.value = catUpdate.rate;
        if (catUpdate.favorite) {

        formElements.favorite.setAttribute('checked', 'checked');
        }
        formElements.description.value = catUpdate.description;

        modalBtn.addEventListener('click', (evt) => {
        forms.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(forms);
            const catObj = Object.fromEntries(formData);
            const cat = { id: catUpdate.id, ...catObj };
            console.log(cat);
            const favorite = cat.favorite ? (cat.favorite = true) : (cat.favorite = false);
            api.updateCat({ ...cat, favorite: favorite }).then((res) => {
            console.log(res);
            refreshCats();
            });
            modal.classList.toggle('active');
            forms.reset();
        });
        });

        modalBtnClose.addEventListener('click', (evt) => {
        modal.remove();
        });
        break;
        case 'cat_card_delete':
        api.getDeleteCat(event.target.value).then((res) => {
        console.log(res);
        refreshCats();
        });
        break;
    }
    }
});

const getViewCardInLocal = (id) => {
let view = JSON.parse(store.getItem('cats'));
let viewCard = view.find((el) => el['id'] == id);
return viewCard;
};

const getNewIdOfCat = () => {
    let res = JSON.parse(store.getItem('cats'));
    if (res.length) {
    return Math.max(...res.map((el) => el.id)) + 1;
} else {
    return 1;
}
};

let year = document.querySelector("#year");

$(document).ready(function () {
  year.innerText = new Date().getFullYear();
});

