window.addEventListener('load', function () {
	

	function updateLocalStorage(data) {
		localStorage.setItem('dataBankCards', JSON.stringify(data));
	}

	function validateBankCard(input, type) {
	 	let cardNumber = input.value;
	 	let cardType = type.options[type.selectedIndex].value;
		let res;

		const regExpVisa = /^4[0-9]{12}(?:[0-9]{3})?$/i;
		const regExpMasterCard = /^5[1-5][0-9]{14}$/i;

		if (cardNumber.length !== 16) return false;

		if (cardType === 'visa') {
			res = cardNumber.search(regExpVisa);
		} else if (cardType === 'master_card') {
			res = cardNumber.search(regExpMasterCard);
		}

		if (res == -1) return false;

		return true;
	} 


	class Model {
		constructor(data) {
			this.data = data;
		}

		addCard(item) {
			/*here checking for item data if() return, dont need if I have form validation*/


			this.data.push(item);
			updateLocalStorage(this.data);
			
		}

		removeCard(item) {
			//let index = this.data.indexOf(item);
			let index = parseInt(item);

			this.data.splice(index, 1);

			updateLocalStorage(this.data);			
		}

	}

	class View {
		constructor(model) {
			this.model = model;
			this.elements = {
				inputs: {
					inputNumber: document.getElementById('input-add-number'),
					userComment: document.getElementById('textarea-add-comment'),
					selectCardType: document.getElementById('card_type')
				},
				addBtn: document.getElementById('js-add-card'),
				notebookBlock: document.getElementById('notebook'),
				confirmFormBlock: document.getElementById('confirm-block'),
				confirmFormElems: {
					inputUserName: document.getElementById('confirm-user-name'),
					inputPassword: document.getElementById('confirm-password'),
					btnConfirm: document.querySelector('.js-btn-confirm'),
					btnCancel: document.querySelector('.js-btn-cancel')
				}
			};
		}

		/*init() {
			this.elements = {
				input: document.getElementById('add-card-form'), //make for this form
				addBtn: document.getElementById('js-add-card'),
				notebookBlock: document.getElementById('notebook')
			}

			renderList(model.data);

		}*/

		createDiv(elem, parent, className, data) {
			let node = document.createElement(elem);
			node.className = `notebook__item notebook__${className}`;

			if(className === 'type') {
				node.appendChild(data);
			} else {
				node.innerHTML = data;
			}	

			parent.appendChild(node);		
		}

		makeTemplateItem(item, i) {
			let divContainer = document.createElement('div');
			divContainer.className = 'notebook__card-container js-card-block';
			divContainer.dataset.item = i;			
			this.createDiv('div', divContainer, 'number', item.number);
			this.createDiv('div', divContainer, 'comment', item.comment);

			let typeImg = document.createElement('img');

			if (item.type === 'visa') {
				typeImg.src = 'img/visa.png';
			} else if (item.type === 'master_card') {
				typeImg.src = 'img/mastercard.png';
			}
			this.createDiv('div', divContainer, 'type', typeImg);

			let btnDelete = document.createElement('button');
			btnDelete.type = 'button';
			btnDelete.className = 'notebook__item notebook__btn-delete js-btn-delete';
			btnDelete.innerHTML = 'Delete';
			divContainer.appendChild(btnDelete);			

			this.elements.notebookBlock.appendChild(divContainer);
		}

		renderList(data) {			
			if (view.elements.notebookBlock.children.length) {
				view.elements.notebookBlock.innerHTML = '';
			}
			
			data.forEach((item, i) => {
				this.makeTemplateItem(item, i);
			});
		}

		showDeleteConfirmForm() {
			if (!this.elements.confirmFormBlock.classList.contains('pop-up-container--active')) {
				this.elements.confirmFormBlock.classList.add('pop-up-container--active');
			}
		}

		hideDeleteConfirmForm() {
			if (this.elements.confirmFormBlock.classList.contains('pop-up-container--active')) {
				this.elements.confirmFormBlock.classList.remove('pop-up-container--active');
			}
		}
	}

	class Controller {
		constructor (model, view) {
			this.model = model;
			this.view = view;
			this.view.elements.addBtn.addEventListener('click', (e) => this.addNewCard(e));
			this.view.elements.notebookBlock.addEventListener('click', (e) => this.initDeleteCard(e));
			this.view.elements.confirmFormElems.btnConfirm.addEventListener('click', (e) => this.checkConfirmForm(e));
			this.view.elements.confirmFormElems.btnCancel.addEventListener('click', (e) => this.cancelIneiDeleteCard(e));
		}

		addNewCard() {
			let newItem = {};
			let inputs = this.view.elements.inputs;

			if (!validateBankCard(inputs.inputNumber, inputs.selectCardType)) {
				alert('invalid card');
				return;
			}

			newItem.number = inputs.inputNumber.value;
			newItem.comment = inputs.userComment.value;
			newItem.type = inputs.selectCardType.options[inputs.selectCardType.selectedIndex].value;
			model.addCard(newItem);
			view.renderList(model.data);
			view.elements.inputs.inputNumber.value = '';
			view.elements.inputs.userComment.value = '';
			view.elements.inputs.selectCardType.selectedIndex = 0;
		}

		initDeleteCard(e) {
			let target = e.target;

			if (!target.classList.contains('js-btn-delete')) return;			

			let cardBlock = target.closest('.js-card-block');
			this.itemAimBlockNumber = cardBlock.dataset.item;

			view.showDeleteConfirmForm();
		}

		checkConfirmForm(e) {
			e.preventDefault();

			if (this.view.elements.confirmFormElems.inputUserName.value === userDate.userName
				&& this.view.elements.confirmFormElems.inputPassword.value === userDate.password) {
				this.deleteCard();
			} else {
				alert('Invalid Username or Password');
			}
		}

		cancelIneiDeleteCard(e) {
			e.preventDefault();

			this.clearConfirmFormInputs();
			this.view.hideDeleteConfirmForm();
		}

		deleteCard() {
			model.removeCard(this.itemAimBlockNumber);
			view.renderList(model.data);

			this.clearConfirmFormInputs();
			this.view.hideDeleteConfirmForm();
		}

		clearConfirmFormInputs() {
			this.view.elements.confirmFormElems.inputUserName.value = '';
			this.view.elements.confirmFormElems.inputPassword.value = '';
		}
	}

	/*let cardList = [
		{
			number: '456745694574',
			comment: 'comment 1',
			type: 'visa'
		},
		{
			number: '456745694574',
			comment: 'comment 1',
			type: 'master_card'
		}
	];*/

	let cardList = [];
	let dataStorage = localStorage.getItem('dataBankCards');
	const userDate = {
		userName: 'admin',
		password: 'admin'
	};

	if (dataStorage) {
		cardList = JSON.parse(dataStorage);
	};

	let model = new Model(cardList);
	let view = new View(model);
	view.renderList(model.data);
	let controller = new Controller(model, view);


});