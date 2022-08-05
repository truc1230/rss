import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ portalId, children }) => {
    const [mounted, setMounted] = useState(false);
    const [_document, setDocument] = useState(null);
    const portalElement = _document?.querySelector(`#${portalId}`);

    useEffect(() => {
        setMounted(true);
        setDocument(document);
        return () => setMounted(false);
    }, []);
    return mounted && portalElement
        ? createPortal(children, portalElement)
        : null;
};

export default Portal;
