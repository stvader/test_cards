window.addEventListener('load', function () {
	const btnAddCard = document.getElementById('js-add-card');
	const notebookBlock = document.getElementById('notebook');

	const userDate = {
		userName: 'admin',
		password: 'admin'
	}

	function createDiv(elem, parent, className, data) {
		let node = document.createElement(elem);
		node.className = `notebook__item notebook__${className}`;

		if(className === 'type') {
			node.appendChild(data);
		} else {
			node.innerHTML = data;
		}	

		parent.appendChild(node);		
	}

	function takeUserDateFromForm() {
		let formBlock = document.getElementById('confirm-block');
		
		if (!formBlock.classList.contains('pop-up-container--active')) {
			formBlock.classList.add('pop-up-container--active');
		}

		
	}

	function confirmUser() {
		takeUserDateFromForm();
	}

	function deleteItem(e) {
		e.preventDefault();

		if (confirmUser()) return;

		let cardBlock = this.closest('.js-card-block');
		cardBlock.remove();
		//console.log(cardBlock);
	}


	class NoteBankCard {
		constructor(options) {
			this.number = options.number;
			this.comment = options.comment;
			this.type = options.type;
		}

		render() {			

			let divContainer = document.createElement('div');
			divContainer.className = 'notebook__card-container js-card-block';
			//add data-item="i"
			createDiv('div', divContainer, 'number', this.number);
			createDiv('div', divContainer, 'comment', this.comment);

			let typeImg = document.createElement('img');

			if (this.type === "visa") {
				typeImg.src = 'img/visa.png';
			} else if (this.type === 'master_card') {
				typeImg.src = 'img/mastercard.png';
			}
			createDiv('div', divContainer, 'type', typeImg);

			let btnDelete = document.createElement('button');
			btnDelete.type = 'button';
			btnDelete.className = 'notebook__item notebook__btn-delete';
			btnDelete.innerHTML = 'Delete';
			divContainer.appendChild(btnDelete);
			btnDelete.addEventListener('click', deleteItem);

			notebookBlock.appendChild(divContainer);
		}

		/*deleteItem() {
			console.log('yes');
		}*/
	}

	function takeInformationFromForm(argument) {
		const addCardForm = document.getElementById('add-card-form');
		const inputNumber = addCardForm.querySelector('#input-add-number');
		const userComment = addCardForm.querySelector('#textarea-add-comment');
		const selectCardType = addCardForm.querySelector('#card_type');



		let newCardData = {
			number: inputNumber.value,
			comment: userComment.value,
			type: selectCardType.options[selectCardType.selectedIndex].value
		};

		return newCardData;
	}

	function addNewCard(e) {
		e.preventDefault();

		let newCardData = takeInformationFromForm();

		let cardNote = new NoteBankCard(newCardData);
		//console.log(cardNote);
		cardNote.render();

	}

	btnAddCard.addEventListener('click', addNewCard);

	//console.log(btnAddCard);
});