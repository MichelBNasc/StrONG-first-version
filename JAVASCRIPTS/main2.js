'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
  document.getElementById('modal').classList.remove('active')
  fieldsClear()
}

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_registro')) ?? []
const setLocalStorage = dbRegistro =>
  localStorage.setItem('db_registro', JSON.stringify(dbRegistro))

//--EXCLUIR REGISTRO--//
const deleteRegistro = index => {
  const dbRegistro = readRegistro()
  dbRegistro.splice(index, 1)
  setLocalStorage(dbRegistro)
}

//--EDITAR REGISTRO--//
const updateRegistro = (index, registro) => {
  const dbRegistro = readRegistro()
  dbRegistro[index] = registro
  setLocalStorage(dbRegistro)
}

//--LER REGISTRO--//
const readRegistro = () => getLocalStorage()

//--CRIAR REGISTRO--//
const createRegistro = registro => {
  const dbRegistro = getLocalStorage()
  dbRegistro.push(registro)
  setLocalStorage(dbRegistro)
}

//--LAYOUT INTERAÇÕES--//
const registroValidFields = () => {
  return document.getElementById('formRegistro').reportValidity()
}

const fieldsClear = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => (field.value = ''))
}

const registerRegistro = () => {
  if (registroValidFields()) {
    const registro = {
      nome: document.getElementById('nome').value,
      departamento: document.getElementById('departamento').value,
      cidade: document.getElementById('cidade').value,
      voluntariong: document.getElementById('voluntariong').value
    }
    const index = document.getElementById('nome').dataset.index
    if (index == 'new') {
      createRegistro(registro)
      updateTable()
      closeModal()
    } else {
      updateRegistro(index, registro)
      updateTable()
      closeModal()
    }
  }
}

const createLine = (registro, index) => {
  const newLine = document.createElement('tr')
  newLine.innerHTML = `
    <td><img src="img/icons/img.png" alt="Sem imagem"></td>
    <td>${registro.nome}</td>
    <td>${registro.departamento}</td>
    <td>${registro.cidade}</td>
    <td>${registro.voluntariong}</td>
    <td>
      <button id="editar-${index}" type="button" class="button green"><img src="img/icons/edit.png" alt="Sem imagem"></button>
      <button id="excluir-${index}" type="button" class="button red"><img src="img/icons/bin.png" alt="Sem imagem"></button>
    </td>
    `
  document.querySelector('#tbRegistro>tbody').appendChild(newLine)
}

const tableClear = () => {
  const lines = document.querySelectorAll('#tbRegistro> tbody tr')
  lines.forEach(line => line.parentNode.removeChild(line))
}

const updateTable = () => {
  const dbRegistro = readRegistro()
  tableClear()
  dbRegistro.forEach(createLine)
}

const fieldsComplete = registro => {
  document.getElementById('nome').value = registro.nome
  document.getElementById('departamento').value = registro.departamento
  document.getElementById('cidade').value = registro.cidade
  document.getElementById('voluntariong').value = registro.voluntariong
  document.getElementById('nome').dataset.index = registro.index
}

const editRegistro = index => {
  const registro = readRegistro()[index]
  registro.index = index
  fieldsComplete(registro)
  openModal()
}

const editDelete = eventRegistro => {
  if (eventRegistro.target.type == 'button') {
    const [action, index] = eventRegistro.target.id.split('-')
    if (action == 'editar') {
      editRegistro(index)
    } else {
      const registro = readRegistro()[index]
      const response = confirm(`Deseja mesmo excluir o Registro?`)
      if (response) {
        deleteRegistro(index)
        updateTable()
      }
    }
  }
}

updateTable()

//--EVENTOS--//
document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('registrar').addEventListener('click', registerRegistro)

document.getElementById('cancelar').addEventListener('click', closeModal)

document
  .querySelector('#tbRegistro>tbody')
  .addEventListener('click', editDelete)

//--FILTER--//
document.getElementById('button2').addEventListener('click', pesquisar)

function pesquisar() {
  var coluna = '4'
  var filtrar, tabela, tr, td, th, i

  filtrar = document.getElementById('busca')
  filtrar = filtrar.value.toUpperCase()

  tabela = document.getElementById('tbRegistro')
  tr = tabela.getElementsByTagName('tr')
  th = tabela.getElementsByTagName('th')

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[coluna]

    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filtrar) > -1) {
        tr[i].style.display = ''
      } else {
        tr[i].style.display = 'none'
      }
    }
  }
}

//--IMAGE UPLOAD--//
var btnClose = document.querySelector('.close-preview-js')
var output = document.getElementById('new')
var loaderFile = function (event) {
  var reader = new FileReader()
  reader.onload = function () {
    output.style.display = 'block'
    btnClose.style.display = 'block'
    output.style.backgroundImage = 'url(' + reader.result + ')'
  }
  reader.readAsDataURL(event.target.files[0])
}

var editarAvatar = document.querySelector('.editar-content')
var buttonFile = document.getElementById('file-preview-js')

editarAvatar.addEventListener('click', function () {
  buttonFile.click()
})

btnClose.addEventListener('click', function () {
  btnClose.style.display = 'none'
  output.style.backgroundImage = "url('')"
  document.getElementById('file-preview-js').value = ''
})
