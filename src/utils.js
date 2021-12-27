/** Converts `"Some String"` to `"some-string"` */
export function toDashCase(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
}

export function getRandomId() {
    return 'w' + (Math.random() + 1).toString(36).substring(2);
}

export function toCamelCase(str) {
    return str.replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export function formikSubmitPlaceholder(values, { setSubmitting }) {
    setTimeout(() => {
        alert(
            `If you see it, replace with corresponding API call.\n` +
                `Values from the form:\n` +
                JSON.stringify(values, null, 2)
        );
        setSubmitting(false);
    }, 400);
}

export const inviteLinks = {
    parseLinkParams: (base64linkPart) => {
        console.log(base64linkPart);
        const json = atob(base64linkPart);

        console.log(json);
        const unescaped = unescape(json);
        console.log(unescaped);
        const linkParams = JSON.parse(unescaped);
        // Idk how to validate objects with PropTypes
        // Don't wanna to add dependencies like ajv
        if (
            !(
                linkParams !== undefined &&
                'company' in linkParams &&
                'id' in linkParams.company &&
                'name' in linkParams.company &&
                'inviter' in linkParams &&
                'id' in linkParams.inviter &&
                'name' in linkParams.inviter
            )
        ) {
            throw new Error();
        }
        return linkParams;
    },
    generateLink: (user, companyName, params = null) => {
        const base64 = btoa(
            escape(
                JSON.stringify({
                    inviter: {
                        id: user.id,
                        name: `${user.firstName} ${user.lastName}`,
                    },
                    company: {
                        id: user.companyId,
                        name: companyName,
                    },
                })
            )
        );
        return `${window.location.hostname}/accept-invite/${base64}${
            params ? '?' + new URLSearchParams(params).toString() : ''
        }`;
    },
};

// Currently not used
export async function getUserWithFetch(token) {
    try {
        const response = await fetch(
            //TODO: change to server address
            `https://localhost:5001/api/user`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (!response.ok) {
            return {
                user: null,
                error: {
                    message: `got response status ${response.status} on get user from DB request`,
                },
                responseStatus: response.status,
            };
        }
        return { user: await response.json(), error: null };
    } catch (error) {
        return {
            user: null,
            error: {
                message: error.message,
                extraMessage: 'Check if database is active',
                stack: error.stack,
            },
        };
    }
}
