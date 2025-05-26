

export const roleMiddleware = (rolesPermitidos) => {
    return(req, res, next) => {
        const { user } = req.session;
        if(user && rolesPermitidos.includes(user.rol)) {
            next();

        } else {
            res.status(403).json({ error: 'Acceso no autorizado' });
        }
    };
};