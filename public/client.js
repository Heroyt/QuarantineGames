const socket = io();


$(() => {
	const $body = $("body");

	let data = undefined;
	if (window.localStorage.userId) {
		data = {
			currentSession: window.localStorage.userSocket,
			name: window.localStorage.userName,
			id: parseInt(window.localStorage.userId)
		}
	}

	socket.emit('login', data);

	socket.on('updateUserData', userData => {
		window.localStorage.userId = userData.id;
		window.localStorage.userName = userData.name;
		window.localStorage.userSocket = userData.currentSession;

		if (userData.name === "" || !window.localStorage.userName) {
			const $modalContent = $(`<div class="center">
				<h3>Abyste mohli hrát, budeme potřebovat vaše jméno</h3>
			</div>`);
			const $nameInput = $(`<input type="text" placeholder="Vaše jméno" class="input" />`);
			$modalContent.append($nameInput);
			$nameInput.keyup(() => {
				window.localStorage.userName = $nameInput.val();
			});
			$nameInput.change(() => {
				window.localStorage.userName = $nameInput.val();
				socket.emit("updateUserData", [window.localStorage.userId, "name", window.localStorage.userName]);
			});
			const $modal = createModal("Zadejte vaše jméno", $modalContent, () => {
				const canClose = $nameInput.val() !== "";
				if (!canClose) {
						$nameInput.addClass("shake").addClass("animated");
						setTimeout(() => {
							$nameInput.removeClass("shake").removeClass("animated");
						}, 500);
				}
				return canClose;
			});
			$body.append($modal);
		}
	});
});

/**
 * Creates a new html modal with a given name
 */
function createModal(modalName = "", content = "", checkClose = () => {return true;}) {
	const $modal = $(`<div class="modal-wrapper">
		<div class="modal">
			<div class="modal-header">
				<h3 class="modal-name">${modalName}</h3>
				<span class="btn btn-danger" data-toggle="modal-close"><i class="fa fa-times"></i></span>
			</div>
			<div class="modal-body"></div>
		</div>
	</div>`);
	$modal.find('.modal-body').append(content);
	$modal.find('[data-toggle="modal-close"]').click(() => {
		if (checkClose()) {
			$modal.addClass("hide");
			setTimeout(() => {
				$modal.remove();
			}, 500);
		}
	});
	return $modal;
}
