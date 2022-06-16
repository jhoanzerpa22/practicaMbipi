export interface Contact
{
    id: string;
    //avatar?: string | null;
    //background?: string | null;
    nombre: string;
    subtitulo: string;
    orden: number;
    url: string;
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag
{
    id?: string;
    title?: string;
}
