import Markdown from 'markdown-to-jsx';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Button } from './Button.jsx';
import { StatItem, Stats } from './Stats';
import { mapEntry } from '../utils/content';

const themeClassMap = {
    imgLeft: 'flex-row-reverse',
    imgRight: ''
};

const ComponentMap = {
    statitem: StatItem,
    button: Button,
    stats: Stats
};

const options = {
    renderNode: {
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const entry = mapEntry(node.data.target);
            const Component = ComponentMap[node.data.target.sys.contentType.sys.id];
            return <Component {...entry} />;
        },
        [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
            return <img src={node.data.target.fields.file.url} alt="My image alt text" />;
        },
        [INLINES.EMBEDDED_ENTRY]: (node, children) => {
            const entry = mapEntry(node.data.target);
            const Component = ComponentMap[node.data.target.sys.contentType.sys.id];
            return <Component {...entry} />;
        }
    }
};

export const Hero = (props) => {
    return (
        <div className="px-12 py-24 bg-gray-100" data-sb-object-id={props.id}>
            <div className={`flex mx-auto max-w-6xl gap-12 ${themeClassMap[props.theme] ?? themeClassMap['imgRight']}`}>
                <div className="max-w-xl py-20 mx-auto lg:shrink-0">
                    <h1 className="mb-6 text-5xl font-bold" data-sb-field-path="heading">
                        {props.heading}
                    </h1>
                    {props.body && (
                        <Markdown options={{ forceBlock: true }} className="mb-4 text-lg" data-sb-field-path="body">
                            {props.body}
                        </Markdown>
                    )}
                    <hr></hr>
                    {props.body2 && (
                        <div data-sb-field-path="body2" className="mb-4">
                            {documentToReactComponents(props.body2, options)}
                        </div>
                    )}
                    <hr></hr>
                    {props.body3 && <div data-sb-field-path="body3" className="mb-4" dangerouslySetInnerHTML={{ __html: props.body3 }}></div>}
                    {props.button && <Button {...props.button} />}
                </div>
                <div className="relative hidden w-full overflow-hidden rounded-md lg:block">
                    {props.image && <Image src={props.image.src} alt={props.image.alt} fill style={{ objectFit: 'contain' }} data-sb-field-path="image" />}
                </div>
            </div>
        </div>
    );
};
