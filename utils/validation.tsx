const phoneLaosRegex =
  /^(85620|020|20|)(2|5|7|9)[0-9]{7}\b|^(8|208|0208|856208)[0-6][0-9]{6}\b|^(85630|030|30|)(2|4|5|7|8|9)[0-9]{6}\b$/;
const phoneVNRegex =
  /^(84|0|)(32|33|34|35|36|37|38|39|56|58|70|76|77|78|79|81|82|83|84|85|86|88|89|90|91|92|93|94|96|97|98)[0-9]{7}\b$/;
const userNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9._-]{6,20}$/;
const emailRegex = /^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?=.{8,36}).*$/;

export {phoneLaosRegex, userNameRegex, emailRegex, phoneVNRegex, passwordRegex};
