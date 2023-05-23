const ModuleDefault = () => {
	console.log('Eksempel på default module function');
}

const ModuleNamed = () => {
	console.log('Eksempel på en name module function');
}

const ModuleNamed2 = () => {
	console.log('Eksempel på en second name module function');
}

export default ModuleDefault
export { ModuleNamed, ModuleNamed2 }
