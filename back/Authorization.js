export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Vous n\'êtes pas autorisé à effectuer cette action. Problème de dev ' });
  }
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Vous n\'êtes pas autorisé à effectuer cette action en étant simple utilisateur' });
  }
};

