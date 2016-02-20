import log from 'cuvva-log';

export default function (error, req, res, next) { // jshint unused:false
	if (typeof error.code !== 'string') {
		error = log.CuvvaError.coerce(error);
		log.warn('traditional_error', [error]);
	}

	res.status(500);
	res.json(error);
}
