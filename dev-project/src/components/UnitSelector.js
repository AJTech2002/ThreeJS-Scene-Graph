
export default function UnitSelector({ onSelected, type }) {

  return (
    <div style={{ width: '90%', height: 70, backgroundColor: 'white', marginTop: 10, textAlign: 'center' }} onMouseDown={() => { onSelected(type); }}>
      {type}
    </div>
  );

}