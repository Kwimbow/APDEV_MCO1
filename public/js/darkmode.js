let darkmode = localStorage.getItem('darkmode');

function enableDarkMode() {
	document.documentElement.classList.add('darkmode');
	localStorage.setItem('darkmode', 'active');
}

function disableDarkMode() {
	document.documentElement.classList.remove('darkmode');
	localStorage.setItem('darkmode', 'inactive');
}

if (darkmode === "active") enableDarkMode();
else disableDarkMode();

document.addEventListener("click", (e) => {

	const toggleBtn = e.target.closest("#dark-mode");

	if (!toggleBtn) return;

	let darkmode = localStorage.getItem("darkmode");

	darkmode === "active"
		? disableDarkMode()
		: enableDarkMode();

});