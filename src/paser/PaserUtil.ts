export function getTagEntity(position: any, tag: any) {
    const { attributes, openStart, openEnd, name, closeStart, closeEnd } = tag;
    let info;
    // Determine if we're targeting an attribute name or attribute value
    for (let i = 0; i < attributes.length; i++) {
        info = hitTestAttribute(position, attributes[i]);
        if (info) {
            info.tag = tag;
            return info;
        }
    }
    // Determine if we over whitespace in the open tag
    let start = { ...openStart, character: openStart.character + name.length + 2 };
    let targetPosition = { start, end: openEnd };
    if (rangeUtil(targetPosition, position) && name) {
        targetPosition.start.character = openStart.character + 1;
        return {
            ...targetPosition,
            tag,
            attribute: {},
            target: 'attributeName',
            substr: ''
        }
    }
    // Determine if we're over the open tag's name
    let end = { ...openStart, character: openStart.character + name.length + 1 };
    targetPosition = { start: openStart, end };
    if (rangeUtil(targetPosition, position)) {
        targetPosition.end.character = openEnd.character++;
        targetPosition.start.character++;
        return {
            ...targetPosition,
            tag,
            target: 'tag',
            substr: tag.name.substr(0, position.character - openStart.character),
        };
    }
    // Determine if we're over whitespace in the child nodes area
    // Determine if we're over the close tag's name
    targetPosition = { start: openEnd, end: closeStart };
    if (rangeUtil(targetPosition, position)) {
        return {
            ...targetPosition,
            tag,
            target: 'tag',
            substr: tag.name.substr(0, position.character - closeStart.character)
        };
    }
}

function rangeUtil(range: any, position: any) {

    if (position.line < range.start.line || position.line > range.end.line) {
        return false;
    }

    if (position.line === range.start.line && position.character < range.start.character) {
        return false;
    }

    return !(position.line === range.end.line && position.character > range.end.character);
}

function hitTestAttribute(position: any, attribute: any): any {
    const { nameStart, nameEnd, valueStart, valueEnd } = attribute;
    let targetPosition = { start: nameStart, end: nameEnd };
    if (rangeUtil(targetPosition, position)) {
        return {
            ...targetPosition,
            attribute,
            target: 'attributeName',
            substr: attribute.name.substr(0, position.character - nameStart.character)
        };
    }
    targetPosition = { start: valueStart, end: valueEnd };
    if (rangeUtil(targetPosition, position)) {
        return {
            ...targetPosition,
            attribute,
            target: 'attributeValue',
            substr: attribute.value.substr(0, position.character - valueStart.character)
        };
    }
}

