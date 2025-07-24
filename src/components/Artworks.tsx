// import axios from "axios";
// import { useEffect, useState } from "react";
// import { DataTable, type DataTableStateEvent } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import type { PaginatorPageChangeEvent } from 'primereact/paginator';
// interface Artwork{
//   id:number;
//   title:string;
//   place_of_origin:string ;
//   artist_display :string;
//   inscriptions:string | null;
//   date_start :number | null;
//   date_end : number | null
// }

// const Artworks:React.FC =()=>{
//     const [artworks , setArtworks] = useState<Artwork[]>([])
//     const [totalRecords , setTotalRecords] = useState(0);
//     const [loading , setLoading] = useState(false);
//     const [page , setPage] = useState(0);
//     const [rows , setRows]= useState(10)
//     const [error , setError] = useState<string | null>(null);

// useEffect(()=>{
//   fetchArtworks(page);
// },[page])

// const fetchArtworks = (currentPage:number)=>{
//   setLoading(true);
//   axios
//   .get(`https://api.artic.edu/api/v1/artworks?page=${currentPage + 1}&limit=${rows}`)
//   .then((res)=>{
//     const artworksFiltered :Artwork[] = res.data.data.map((item:any)=>({
//       id: item.id,
//           title: item.title,
//           place_of_origin: item.place_of_origin,
//           artist_display: item.artist_display,
//           inscriptions: item.inscriptions,
//           date_start: item.date_start,
//           date_end: item.date_end,
//     }));
//     setArtworks(artworksFiltered);
//     setTotalRecords(res.data.pagination.total);
//   })
//   .catch(()=>{
//     setArtworks([]);
//     setTotalRecords(0);
//   })
//   .finally(()=>setLoading(false));
// }

// const onPageChange = (event: DataTableStateEvent) => {
//   if (typeof event.page === 'number') {
//     setPage(event.page);
//   }
// };

//     return (
//         <div>
//           <h2>Artworks table</h2>
//           <DataTable 
//           value={artworks}
//           loading={loading}
//           paginator
//           rows={rows}
//           totalRecords={totalRecords}
//           onPage={onPageChange}
//           lazy
//           first={page*rows}
//           responsiveLayout="scroll"
//           dataKey="id">
//             <Column field="title" header="Title" sortable/>
//             <Column field="place_of_origin" header="Place of Origin" sortable />
//         <Column field="artist_display" header="Artist" />
//         <Column field="inscriptions" header="Inscriptions" />
//         <Column field="date_start" header="Date Start" />
//         <Column field="date_end" header="Date End" />
//           </DataTable>

//         </div>
//     )
// }

// export default Artworks;
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

const Artworks: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [rowCountToSelect, setRowCountToSelect] = useState<number | null>(null);
  const overlayRef = useRef<OverlayPanel>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = () => {
    setLoading(true);
    axios
      .get('https://api.artic.edu/api/v1/artworks?page=1&limit=100')
      .then((res) => {
        const data: Artwork[] = res.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          place_of_origin: item.place_of_origin,
          artist_display: item.artist_display,
          inscriptions: item.inscriptions,
          date_start: item.date_start,
          date_end: item.date_end,
        }));
        setArtworks(data);
      })
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false));
  };

  const onRowSelectChange = (e: { value: Artwork[] }) => {
    setSelectedRows(e.value);
  };

  const handleBulkSelect = () => {
    if (!rowCountToSelect || rowCountToSelect < 1) return;

    const toSelect = artworks.slice(0, rowCountToSelect);
    const updatedSelection = [...selectedRows];

    toSelect.forEach((art) => {
      if (!updatedSelection.find((r) => r.id === art.id)) {
        updatedSelection.push(art);
      }
    });

    setSelectedRows(updatedSelection);
    overlayRef.current?.hide();
  };

  const headerWithOverlay = () => (
    <div className="flex align-items-center gap-2">
      <span>Select</span>
      <Button
        icon="pi pi-chevron-down"
        rounded
        text
        onClick={(e) => overlayRef.current?.toggle(e)}
        aria-haspopup
        aria-controls="overlay_panel"
      />
      <OverlayPanel ref={overlayRef} id="overlay_panel">
        <div className="p-2 w-60">
          <h4>Select N Rows</h4>
          <InputNumber
            value={rowCountToSelect}
            onValueChange={(e) => setRowCountToSelect(e.value ?? null)}
            min={1}
            max={artworks.length}
            placeholder="Rows to select"
            className="w-full"
          />
          <Button
            label="Select"
            className="mt-2 w-full"
            onClick={handleBulkSelect}
          />
        </div>
      </OverlayPanel>
    </div>
  );

  return (
    <div className="p-4">
      <h2>Art Institute of Chicago - Artworks</h2>
      <DataTable
        value={artworks}
        loading={loading}
        paginator
        rows={10}
        dataKey="id"
        selection={selectedRows}
        onSelectionChange={onRowSelectChange}
        selectionMode="multiple"
        responsiveLayout="scroll"
      >
        <Column
          selectionMode="multiple"
          header={headerWithOverlay()}
          style={{ width: '3rem' }}
        />
        <Column field="title" header="Title" sortable />
        <Column field="place_of_origin" header="Place of Origin" sortable />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>
    </div>
  );
};

export default Artworks;
